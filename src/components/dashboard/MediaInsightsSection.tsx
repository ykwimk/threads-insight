import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MediaInsightsDataById, PostsData } from '@/types';
import LoadingSpinner from '../common/LoadingSpinner';
import PostCard from './PostCard';
import DetailInsightByPostDialog from './DetailInsightByPostDialog';

interface Props {
  profileId: string;
}

export default function MediaInsightsSection({ profileId }: Props) {
  const [mediaInsights, setMediaInsights] = useState<MediaInsightsDataById>([]);
  const [posts, setPosts] = useState<PostsData[]>([]);
  const [afterCursor, setAfterCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedPostId, setSelectedPostId] = useState<string>('');

  const listRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const findSelectedPost = useMemo(() => {
    return posts.find((post) => post.id === selectedPostId) || null;
  }, [posts, selectedPostId]);

  const findSelectedMediaInsight = useMemo(() => {
    return (
      mediaInsights.find((insight) => insight.id === selectedPostId)
        ?.insights || []
    );
  }, [mediaInsights, selectedPostId]);

  const fetchData = useCallback(
    async (after: string | null = null) => {
      if (loading) return;

      setLoading(true);

      try {
        const res = await fetch(`/api/dashboard/media-insights`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ profileId, after }),
        });

        const json = await res.json();

        if (res.ok) {
          setMediaInsights((prev: MediaInsightsDataById) => [
            ...prev,
            ...json.mediaData,
          ]);
          setPosts((prev: PostsData[]) => [...prev, ...json.posts]);
          setAfterCursor(json.afterCursor);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [loading],
  );

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!sentinelRef.current || !afterCursor) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !loading) {
        fetchData(afterCursor);
      }
    });

    observerRef.current.observe(sentinelRef.current);

    return () => observerRef.current?.disconnect();
  }, [fetchData, afterCursor, loading]);

  return (
    <div className="p-6">
      <h2 className="mb-4 text-xl font-bold">미디어 인사이트</h2>
      {posts.length === 0 && !loading && (
        <p className="text-gray-500">데이터를 불러오는 중입니다...</p>
      )}
      <div
        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
        ref={listRef}
      >
        {posts ? (
          posts.map((post: PostsData) => {
            const findInsightByPostId = mediaInsights.find(
              (insight) => insight.id === post.id,
            );
            const isEmptyTextPost =
              post.media_type === 'TEXT_POST' && !post.text;

            if (!findInsightByPostId || isEmptyTextPost) return;

            return (
              <div key={post.id}>
                <PostCard
                  post={post}
                  insights={findInsightByPostId.insights}
                  onCardClick={() => setSelectedPostId(post.id)}
                />
              </div>
            );
          })
        ) : (
          <p className="text-gray-500">해당 데이터를 불러올 수 없습니다.</p>
        )}
      </div>
      <div ref={sentinelRef} className="h-1" />
      {loading && (
        <div className="mt-4 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      )}
      {/* 포스트 상세 인사이트 */}
      {selectedPostId && (
        <DetailInsightByPostDialog
          selectedPostId={selectedPostId}
          findSelectedPost={findSelectedPost}
          findSelectedMediaInsight={findSelectedMediaInsight}
          onClose={() => setSelectedPostId('')}
        />
      )}
    </div>
  );
}
