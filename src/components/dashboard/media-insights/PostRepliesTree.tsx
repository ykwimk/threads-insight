import Link from 'next/link';
import { ConversationData } from '@/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface Props {
  replies: ConversationData[];
  depth?: number;
}

export default function PostRepliesTree({ replies, depth = 0 }: Props) {
  return (
    <Accordion type="multiple" className="space-y-2">
      {replies.map((reply) => (
        <AccordionItem
          key={reply.id}
          value={reply.id}
          className={`${depth === 0 ? `rounded-md border px-3 shadow-sm` : 'border-0'}`}
        >
          <AccordionTrigger
            className={`gap-3 hover:no-underline ${
              !reply.children?.length ? '[&>svg]:hidden' : ''
            }`}
            disabled={!reply.children?.length}
          >
            <div className="flex-1">
              <div className="flex w-full items-center justify-between text-sm">
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
          </AccordionTrigger>
          <AccordionContent>
            {reply.children?.length > 0 && (
              <div className="ml-2.5 border-l-2 border-gray-200 pl-2.5">
                <PostRepliesTree replies={reply.children} depth={depth + 1} />
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
