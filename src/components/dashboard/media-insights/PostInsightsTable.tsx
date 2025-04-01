import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MediaInsightsData } from '@/types';

interface Props {
  selectedMediaInsight: Array<MediaInsightsData>;
}

export default function PostInsightsTable({ selectedMediaInsight }: Props) {
  return (
    <>
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
          {selectedMediaInsight.length > 0 ? (
            selectedMediaInsight.map((insight) => (
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
    </>
  );
}
