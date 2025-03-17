import { useCallback, useEffect, useState } from 'react';
import { RepliesData } from '@/types';
import { Skeleton } from '../ui/skeleton';

interface Props {
  selectedPostId: string;
}

export default function PostReplies({ selectedPostId }: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const [replies, setReplies] = useState<RepliesData[]>([]);

  const fetchData = useCallback(async () => {
    if (loading) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/dashboard/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mediaId: selectedPostId }),
      });

      const json = await res.json();

      if (res.ok) {
        setReplies(json.results.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [loading, selectedPostId]);

  useEffect(() => {
    fetchData();
  }, []);

  if (!replies) return null;

  return (
    <div className="flex flex-col">
      <h3 className="mb-2 text-lg font-semibold">💬 댓글</h3>
      {loading ? (
        <Skeleton className="h-16 w-full rounded-md" />
      ) : replies && replies.length >= 0 ? (
        <div className="max-h-[300px] space-y-4 overflow-y-auto py-2">
          {replies.map((reply) => (
            <div key={reply.id} className="rounded-md border p-3 shadow-sm">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">@{reply.username}</span>
                <span className="text-xs text-gray-500">
                  {new Date(reply.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="mt-2 text-sm">{reply.text || '미디어 첨부'}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">댓글이 없습니다.</p>
      )}
    </div>
  );
}
