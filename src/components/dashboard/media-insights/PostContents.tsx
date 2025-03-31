import { useCallback, useEffect, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { formatRelativeTime } from '@/lib/utils';
import { PostsData } from '@/types';

interface Props {
  findSelectedPost: PostsData | null;
}

export default function PostContents({ findSelectedPost }: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const [images, setImages] = useState<
    Array<{ id: string; media_url: string }>
  >([]);

  const fetchData = useCallback(async () => {
    if (loading || !findSelectedPost) return;

    setLoading(true);

    try {
      if (!findSelectedPost.children) return;

      const { data } = findSelectedPost.children;

      if (!data) return;

      const mediaIds = data.map((v) => v.id);

      const res = await fetch(`/api/dashboard/carousel-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mediaIds }),
      });

      const json = await res.json();
      setImages(json.results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [loading, findSelectedPost]);

  useEffect(() => {
    fetchData();
  }, []);

  if (!findSelectedPost)
    return (
      <p className="text-center text-sm text-gray-500">
        포스트 내용이 없습니다.
      </p>
    );

  const { media_type, media_url, text, timestamp } = findSelectedPost;

  return (
    <div>
      <div className="flex items-center justify-end">
        <span className="text-xs text-gray-500">
          {formatRelativeTime(timestamp)}
        </span>
      </div>
      {media_url &&
        (media_type === 'CAROUSEL_ALBUM' && images && !!images.length ? (
          <Carousel>
            <CarouselContent>
              {images.map((image: { id: string; media_url: string }) => {
                return (
                  <CarouselItem key={image.id}>
                    <img
                      src={image.media_url}
                      alt="미디어"
                      className="w-full object-cover pt-4"
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
            className="w-full object-cover pt-4"
          />
        ))}
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
