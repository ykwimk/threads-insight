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

interface Props {
  selectedPostId: string;
  findSelectedPost: PostsData | null;
  findSelectedMediaInsight: Array<MediaInsightsData>;
  onClose: () => void;
}

export default function DetailInsightByPostDialog({
  selectedPostId,
  findSelectedPost,
  findSelectedMediaInsight,
  onClose,
}: Props) {
  if (!findSelectedPost) {
    return null;
  }

  return (
    <Dialog open={!!selectedPostId} onOpenChange={onClose}>
      <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>📝 포스트 상세 정보</DialogTitle>
          <DialogDescription>
            선택한 포스트의 내용과 상세 인사이트를 확인하세요.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-6">
            {findSelectedPost.media_url && (
              <img
                src={findSelectedPost.media_url}
                alt="미디어"
                className="w-full object-cover"
              />
            )}
            {findSelectedPost.text && (
              <div className="flex items-center justify-center break-keep py-4">
                <span className="text-sm">{findSelectedPost.text}</span>
              </div>
            )}
          </div>
          <div className="mb-6">
            <PostInsightsTable
              findSelectedMediaInsight={findSelectedMediaInsight}
            />
          </div>
          <div>
            {/* 포스트 대화 (댓글 & 대댓글) */}
            <PostConversation selectedPostId={selectedPostId} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
