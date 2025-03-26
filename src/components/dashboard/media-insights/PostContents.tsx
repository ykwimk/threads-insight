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

  return (
    <div>
      <div className="flex items-center justify-end">
        <span className="text-xs text-gray-500">
          {formatRelativeTime(findSelectedPost.timestamp)}
        </span>
      </div>
      {findSelectedPost.media_url && (
        <img
          src={findSelectedPost.media_url}
          alt="미디어"
          className="w-full object-cover pt-4"
        />
      )}
      <div>
        {findSelectedPost.text && (
          <div className="break-keep py-4">
            <p className="text-sm">{findSelectedPost.text}</p>
          </div>
        )}
      </div>
    </div>
  );
}
