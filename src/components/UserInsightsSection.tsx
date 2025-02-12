import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Button } from './ui/button';
import DashboardCard from './DashboardCard';

interface Props {
  data: any;
  fetchData: (breakdown: string | undefined) => void;
}

export default function UserInsightsSection({ data, fetchData }: Props) {
  const [breakdown, setBreakdown] = useState<string | undefined>(undefined);

  const dummyData = {
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

  const followerData = data?.follower_demographics?.total_value?.value || {};
  const breakdownLabels: Record<string, string> = {
    country: '국가',
    city: '도시',
    age: '연령대',
    gender: '성별',
  };

  return (
    <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-4">
      <DashboardCard
        title="총 조회수"
        value={data.views?.total_value?.value || 0}
      />
      <DashboardCard
        title="총 좋아요"
        value={data.likes?.total_value?.value || 0}
      />
      <DashboardCard
        title="총 리플"
        value={data.replies?.total_value?.value || 0}
      />
      <DashboardCard
        title="팔로워 수"
        value={data.followers_count?.total_value?.value || 0}
      />
      <div className="col-span-2">
        <h2 className="mb-4 text-xl font-bold">팔로워 분석</h2>
        <div className="flex items-center justify-start gap-2">
          <Select
            value={breakdown}
            onValueChange={(value) => setBreakdown(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="-" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="country">국가별</SelectItem>
                <SelectItem value="city">도시별</SelectItem>
                <SelectItem value="age">연령별</SelectItem>
                <SelectItem value="gender">성별별</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button disabled={!breakdown} onClick={() => fetchData(breakdown)}>
            데이터 불러오기
          </Button>
        </div>
      </div>
      {breakdown && (
        <div className="col-span-2">
          <h2 className="mb-4 text-xl font-bold">
            {breakdownLabels[breakdown]}별 팔로워 분포
          </h2>
          {Object.keys(followerData).length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{breakdownLabels[breakdown]}</TableHead>
                  <TableHead>팔로워 수</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(followerData).map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell>{key}</TableCell>
                    <TableCell>{String(value)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-gray-500">해당 데이터를 불러올 수 없습니다.</p>
          )}
        </div>
      )}
    </div>
  );
}
