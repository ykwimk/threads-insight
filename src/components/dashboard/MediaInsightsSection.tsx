import { useEffect, useRef, useState } from 'react';
import { MediaInsightsDataByIdType, PostDataType } from '@/types';
import LoadingSpinner from '../common/LoadingSpinner';
import PostCard from './PostCard';
import DetailInsightByPostDialog from './DetailInsightByPostDialog';

export default function MediaInsightsSection() {
  const [mediaInsights, setMediaInsights] = useState<MediaInsightsDataByIdType>(
    [],
  );
  const [posts, setPosts] = useState<PostDataType[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedPostId, setSelectedPostId] = useState<string>('');

  const listRef = useRef<HTMLDivElement>(null);
  const sentinel = useRef<HTMLDivElement>(null);

  const fetchData = async (cursor: string | null = null) => {
    if (cursor) {
      setLoading(true);
    }

    try {
      const res = await fetch(
        `/api/dashboard/media-insights${cursor ? `?after=${cursor}` : ''}`,
      );

      const json = await res.json();

      if (res.ok) {
        setMediaInsights((prev: MediaInsightsDataByIdType) => [
          ...prev,
          ...json.mediaInsights,
        ]);
        setPosts((prev: PostDataType[]) => [...prev, ...json.posts]);
        setNextCursor(json.nextCursor);
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (cursor) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let observer: IntersectionObserver;

    if (!!posts.length && sentinel.current && nextCursor && !loading) {
      observer = new window.IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          fetchData(nextCursor);
        }
      });

      observer.observe(sentinel.current);
    }

    return () => observer && observer.disconnect();
  }, [posts, loading, sentinel, nextCursor, fetchData]);

  return (
    <div className="p-6">
      <h2 className="mb-4 text-xl font-bold">미디어 인사이트</h2>
      {posts.length > 0 ? (
        <div
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
          ref={listRef}
        >
          {posts ? (
            posts.map((post: PostDataType) => {
              const findInsightByPostId = mediaInsights.find(
                (insight) => insight.id === post.id,
              );

              if (!findInsightByPostId) return;

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
      ) : (
        <p className="text-gray-500">데이터를 불러오는 중입니다...</p>
      )}
      <div ref={sentinel}>
        {loading && (
          <div className="mt-4 flex items-center justify-center">
            <LoadingSpinner />
          </div>
        )}
      </div>
      {/* 포스트 상세 인사이트 */}
      {selectedPostId && (
        <DetailInsightByPostDialog
          selectedPostId={selectedPostId}
          mediaInsights={mediaInsights}
          onClose={() => setSelectedPostId('')}
        />
      )}
    </div>
  );
}
