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

interface Props {
  mediaInsights: MediaInsightsDataByIdType;
  selectedPostId: string;
}

export default function PostDetailInsight({
  mediaInsights,
  selectedPostId,
}: Props) {
  const getSelectedPostId = useMemo(() => {
    return (
      mediaInsights.find((insight) => insight.id === selectedPostId)
        ?.insights || []
    );
  }, [mediaInsights, selectedPostId]);

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold">선택한 게시물의 상세 인사이트</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>메트릭</TableHead>
            <TableHead>값</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {getSelectedPostId.map((insight: any) => (
            <TableRow key={insight.name}>
              <TableCell>{insight.title}</TableCell>
              <TableCell>{insight.values[0]?.value || 0}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
