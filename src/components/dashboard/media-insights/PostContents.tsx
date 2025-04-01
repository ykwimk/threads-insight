import { useCallback, useEffect, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { formatRelativeTime } from '@/lib/utils';
import { PostResult, PostsData } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
  selectedPost: PostsData | null;
}

export default function PostContents({ selectedPost }: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const [images, setImages] = useState<Array<PostResult>>([]);

  const fetchData = useCallback(async (mediaIds: string[]) => {
    setLoading(true);

    try {
      const res = await fetch('/api/dashboard/carousel-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mediaIds }),
      });
      const json = await res.json();
      return json.results;
    } catch (err) {
      console.error('Failed to fetch data:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const loadData = useCallback(async () => {
    if (!selectedPost || selectedPost.media_type !== 'CAROUSEL_ALBUM') return;

    const children = selectedPost.children?.data ?? [];
    const mediaIds = children.map((child) => child.id);
    if (mediaIds.length === 0) return;

    const results = await fetchData(mediaIds);
    setImages(results);
  }, [selectedPost, fetchData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (!selectedPost)
    return (
      <p className="text-center text-sm text-gray-500">
        포스트 내용이 없습니다.
      </p>
    );

  const { media_type, media_url, text, timestamp } = selectedPost;
  const isCarousel = media_type === 'CAROUSEL_ALBUM' && images.length > 0;

  return (
    <div>
      <div className="flex items-center justify-end">
        <span className="text-xs text-gray-500">
          {formatRelativeTime(timestamp)}
        </span>
      </div>
      {media_url && (
        <div className="pt-4">
          {loading ? (
            <Skeleton className="h-80 w-full rounded-md" />
          ) : isCarousel ? (
            <Carousel>
              <CarouselContent className="items-center">
                {images.map((image: PostResult) => {
                  return (
                    <CarouselItem key={image.id}>
                      <img
                        src={image.media_url}
                        alt="미디어"
                        className="w-full rounded-md object-cover"
                      />
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <CarouselNext className="right-2" />
              <CarouselPrevious className="left-2" />
            </Carousel>
          ) : (
            <img
              src={media_url}
              alt="미디어"
              className="w-full rounded-md object-cover"
            />
          )}
        </div>
      )}
      <div>
        {text && (
          <div className="break-keep py-4">
            <p className="text-sm">{text}</p>
          </div>
        )}
      </div>
    </div>
  );
}
