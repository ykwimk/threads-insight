import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { RepliesData } from '@/types';
import { Skeleton } from '../../ui/skeleton';

interface Props {
  selectedPostId: string;
}

export default function PostReplies({ selectedPostId }: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const [conversation, setConversation] = useState<RepliesData[]>([]);

  const fetchData = useCallback(async () => {
    if (loading) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/dashboard/conversation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mediaId: selectedPostId }),
      });

      const json = await res.json();

      if (res.ok) {
        setConversation(json.results.data);
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

  if (!conversation) return null;

  return (
    <div className="flex flex-col">
      <h3 className="mb-2 text-lg font-semibold">💬 댓글</h3>
      {loading ? (
        <Skeleton className="h-16 w-full rounded-md" />
      ) : conversation && conversation.length > 0 ? (
        <div className="max-h-[300px] space-y-4 overflow-y-auto py-2">
          {conversation.map((reply) => (
            <div key={reply.id} className="rounded-md border p-3 shadow-sm">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">
                  <Link
                    href={reply.permalink}
                    className="underline"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    @{reply.username}
                  </Link>
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(reply.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="mt-2 text-sm">{reply.text || '미디어 첨부'}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-sm text-gray-500">댓글이 없습니다.</p>
      )}
    </div>
  );
}
