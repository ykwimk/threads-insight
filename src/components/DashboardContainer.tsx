'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

const ChartComponent = dynamic(() => import('./Chart'), { ssr: false });

export default function ThreadsInsightsDashboard() {
  const [data, setData] = useState<any>(null);
  const [breakdown, setBreakdown] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

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

  const fetchData = async (breakdown?: string) => {
    setLoading(true);

    try {
      const url = breakdown
        ? `/api/dashboard?breakdown=${breakdown}`
        : '/api/dashboard';

      const res = await fetch(url);
      const json = await res.json();
      setData(json.userInsights);
      setLoading(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (window.location.hash === '#_') {
      history.replaceState(
        {},
        document.title,
        window.location.pathname + window.location.search,
      );
    }

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>No data available.</p>;

  return (
    <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>총 조회수</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {data.views?.total_value?.value || 0}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>총 좋아요</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {data.likes?.total_value?.value || 0}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>총 리플</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {data.replies?.total_value?.value || 0}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>팔로워 수</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {data.followers_count?.total_value?.value || 0}
          </p>
        </CardContent>
      </Card>
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
      {/* 선택한 breakdown 데이터 표시 */}
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
            {dummyData.mediaInsights.map((post: any) => (
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
        <ChartComponent data={dummyData} />
      </div>
    </div>
  );
}
