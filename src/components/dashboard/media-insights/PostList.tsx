import { useEffect, useRef } from 'react';
import { MediaInsightsDataById, PostsData } from '@/types';
import PostCard from './PostCard';

interface Props {
  posts: PostsData[];
  mediaInsights: MediaInsightsDataById;
  afterCursor: string | null;
  loading: boolean;
  fetchData: (after: string | null) => void;
  setSelectedPostId: (postId: string) => void;
}

export default function PostList({
  posts,
  mediaInsights,
  afterCursor,
  loading,
  fetchData,
  setSelectedPostId,
}: Props) {
  const listRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

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
    <div
      className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
      ref={listRef}
    >
      {posts ? (
        posts.map((post: PostsData) => {
          const findInsightByPostId = mediaInsights.find(
            (insight) => insight.id === post.id,
          );
          const isEmptyTextPost = post.media_type === 'TEXT_POST' && !post.text;

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
        <p className="text-center text-gray-500">
          해당 데이터를 불러올 수 없습니다.
        </p>
      )}
      <div ref={sentinelRef} className="h-1" />
    </div>
  );
}
