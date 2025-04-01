import { MediaInsightsData, PostsData } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import PostConversation from './PostConversation';
import PostInsightsTable from './PostInsightsTable';
import PostContents from './PostContents';

interface Props {
  selectedPost: PostsData | null;
  selectedMediaInsight: Array<MediaInsightsData>;
  onClose: () => void;
}

export default function PostDetailDialog({
  selectedPost,
  selectedMediaInsight,
  onClose,
}: Props) {
  if (!selectedPost || !selectedMediaInsight) {
    return null;
  }

  return (
    <Dialog open={!!selectedPost} onOpenChange={onClose}>
      <DialogContent className="flex max-h-[90vh] max-w-2xl flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>📝 포스트 상세 정보</DialogTitle>
          <DialogDescription>
            선택한 포스트의 내용과 상세 인사이트를 확인하세요.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto p-4">
          <section className="mb-6">
            <PostContents selectedPost={selectedPost} />
          </section>
          <section className="mb-6">
            <PostInsightsTable selectedMediaInsight={selectedMediaInsight} />
          </section>
          <section>
            {/* 포스트 대화 (댓글 & 대댓글) */}
            <PostConversation selectedPostId={selectedPost.id} />
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
