import dynamic from 'next/dynamic';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const ChartComponent = dynamic(() => import('./Chart'), { ssr: false });

export default function MediaInsightsSection() {
  const data = {
    totalViews: 1234,
    totalLikes: 567,
    totalReplies: 89,
    followerCount: 1000,
    mediaInsights: [
      { id: 'post1', views: 100, likes: 50, replies: 5, reposts: 2 },
      { id: 'post2', views: 200, likes: 80, replies: 10, reposts: 4 },
    ],
    profileViews: [
      { date: '2024-07-12', views: 10 },
      { date: '2024-07-13', views: 20 },
      { date: '2024-07-14', views: 30 },
    ],
  };

  return (
    <div className="p-6">
      <div className="col-span-2">
        <h2 className="mb-4 text-xl font-bold">미디어 인사이트</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>포스트 ID</TableHead>
              <TableHead>조회수</TableHead>
              <TableHead>좋아요</TableHead>
              <TableHead>리플</TableHead>
              <TableHead>리포스트</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.mediaInsights.map((post: any) => (
              <TableRow key={post.id}>
                <TableCell>{post.id}</TableCell>
                <TableCell>{post.views}</TableCell>
                <TableCell>{post.likes}</TableCell>
                <TableCell>{post.replies}</TableCell>
                <TableCell>{post.reposts}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="col-span-2">
        <h2 className="mb-4 text-xl font-bold">프로필 조회수 변화</h2>
        <ChartComponent data={data} />
      </div>
    </div>
  );
}
