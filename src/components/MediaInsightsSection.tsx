import { useEffect, useState } from 'react';
import { MediaInsightsDataByIdType, PostDataType } from '@/types';
import LoadingSpinner from './LoadingSpinner';
import PostCard from './PostCard';
import PostDetailInsight from './PostDetailInsight';

export default function MediaInsightsSection() {
  const [mediaInsights, setMediaInsights] = useState<MediaInsightsDataByIdType>(
    [],
  );
  const [posts, setPosts] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedPostId, setSelectedPostId] = useState<string>('');

  const fetchData = async () => {
    setLoading(true);

    try {
      const res = await fetch('/api/dashboard/media-insights');
      const json = await res.json();

      if (res.ok) {
        setMediaInsights(json.mediaInsights);
        setPosts(json.posts.data);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h2 className="mb-4 text-xl font-bold">미디어 인사이트</h2>
      {loading ? (
        <div className="flex items-center justify-center max-md:p-5">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts ? (
            posts.map((post: PostDataType) => {
              const findInsightByPostId = mediaInsights.find(
                (insight) => insight.id === post.id,
              );

              if (!findInsightByPostId) return;

              return (
                <PostCard
                  key={post.id}
                  post={post}
                  insights={findInsightByPostId.insights}
                  onCardClick={() => setSelectedPostId(post.id)}
                />
              );
            })
          ) : (
            <p className="text-gray-500">해당 데이터를 불러올 수 없습니다.</p>
          )}
        </div>
      )}
      {/* 포스트 상세 인사이트 */}
      {selectedPostId && (
        <PostDetailInsight
          selectedPostId={selectedPostId}
          mediaInsights={mediaInsights}
          onClose={() => setSelectedPostId('')}
        />
      )}
    </div>
  );
}
