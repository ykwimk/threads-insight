import { useCallback, useEffect, useMemo, useState } from 'react';
import { MediaInsightsDataById, PostsData } from '@/types';
import LoadingSpinner from '../../common/LoadingSpinner';
import DetailInsightByPostDialog from './DetailInsightByPostDialog';
import PostList from './PostList';

interface Props {
  profileId: string;
}

export default function MediaInsightsSection({ profileId }: Props) {
  const [mediaInsights, setMediaInsights] = useState<MediaInsightsDataById>([]);
  const [posts, setPosts] = useState<PostsData[]>([]);
  const [afterCursor, setAfterCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedPostId, setSelectedPostId] = useState<string>('');

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

  return (
    <div className="p-6">
      <h2 className="mb-4 text-xl font-bold">미디어 인사이트</h2>
      {loading && posts.length === 0 ? (
        <div className="mt-4 flex items-center justify-center">
          <p className="text-gray-500">데이터를 불러오는 중입니다...</p>
        </div>
      ) : (
        <PostList
          posts={posts}
          mediaInsights={mediaInsights}
          afterCursor={afterCursor}
          loading={loading}
          fetchData={fetchData}
          setSelectedPostId={setSelectedPostId}
        />
      )}
      {loading && !!posts.length && (
        <div className="mt-4 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      )}
      {/* 포스트 상세 인사이트 모달 */}
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
