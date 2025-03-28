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
  if (!findSelectedPost)
    return (
      <p className="text-center text-sm text-gray-500">
        포스트 내용이 없습니다.
      </p>
    );

  const { media_type, media_url, text, timestamp, children } = findSelectedPost;

  return (
    <div>
      <div className="flex items-center justify-end">
        <span className="text-xs text-gray-500">
          {formatRelativeTime(timestamp)}
        </span>
      </div>
      {media_url &&
        (media_type === 'CAROUSEL_ALBUM' && children ? (
          <Carousel>
            <CarouselContent>
              <CarouselItem>
                <img
                  src={media_url}
                  alt="미디어"
                  className="w-full object-cover pt-4"
                />
              </CarouselItem>
              <CarouselItem>
                <img
                  src={media_url}
                  alt="미디어"
                  className="w-full object-cover pt-4"
                />
              </CarouselItem>
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
