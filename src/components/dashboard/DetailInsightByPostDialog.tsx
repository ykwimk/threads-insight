import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MediaInsightsDataType, PostDataType } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

interface Props {
  selectedPostId: string;
  findSelectedPost: PostDataType | null;
  findSelectedMediaInsight: Array<MediaInsightsDataType>;
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
          <div>
            {/* <h3 className="mb-2 text-lg font-semibold">📊 인사이트</h3> */}
            <Table className="border-color-gray-200 border">
              <TableHeader>
                <TableRow>
                  <TableHead className="border-color-gray-200 border-r">
                    메트릭(metric)
                  </TableHead>
                  <TableHead className="text-right">값(value)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {findSelectedMediaInsight.length > 0 ? (
                  findSelectedMediaInsight.map((insight) => (
                    <TableRow key={insight.name}>
                      <TableCell className="border-color-gray-200 border-r">
                        {insight.title}
                      </TableCell>
                      <TableCell className="text-right">
                        {insight.values[0]?.value || 0}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center">
                      인사이트 데이터가 없습니다.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
