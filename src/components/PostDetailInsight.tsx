import { useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MediaInsightsDataByIdType } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

interface Props {
  mediaInsights: MediaInsightsDataByIdType;
  selectedPostId: string;
  onClose: () => void;
}

export default function PostDetailInsight({
  mediaInsights,
  selectedPostId,
  onClose,
}: Props) {
  const getSelectedPostId = useMemo(() => {
    return (
      mediaInsights.find((insight) => insight.id === selectedPostId)
        ?.insights || []
    );
  }, [mediaInsights, selectedPostId]);

  return (
    <Dialog open={!!selectedPostId} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>📈 상세 인사이트</DialogTitle>
          <DialogDescription>
            선택한 게시물의 상세 인사이트를 확인하세요.
          </DialogDescription>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>메트릭</TableHead>
              <TableHead>값</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {getSelectedPostId.length > 0 ? (
              getSelectedPostId.map((insight) => (
                <TableRow key={insight.name}>
                  <TableCell>{insight.title}</TableCell>
                  <TableCell>{insight.values[0]?.value || 0}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} className="text-center">
                  데이터 없음
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}
