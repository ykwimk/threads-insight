import { useCallback, useEffect, useState } from 'react';
import { ConversationData } from '@/types';
import useAbortController from '@/hooks/useAbortController';
import { Skeleton } from '../../ui/skeleton';
import PostRepliesTree from './PostRepliesTree';

interface Props {
  selectedPostId: string;
}

export default function PostConversation({ selectedPostId }: Props) {
  const getSignal = useAbortController();

  const [loading, setLoading] = useState<boolean>(false);
  const [conversation, setConversation] = useState<ConversationData[]>([]);

  const fetchData = useCallback(async () => {
    if (loading) return;

    setLoading(true);

    try {
      const signal = getSignal();

      const res = await fetch(`/api/dashboard/conversation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mediaId: selectedPostId }),
        signal,
      });

      const json = await res.json();

      if (res.ok) {
        setConversation(json.results.data);
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('Fetch aborted!');
      } else {
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  }, [loading, selectedPostId, getSignal]);

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
        <PostRepliesTree replies={conversation} />
      ) : (
        <p className="text-center text-sm text-gray-500">댓글이 없습니다.</p>
      )}
    </div>
  );
}
