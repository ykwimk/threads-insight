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

export default function FollowerDemographicsSection() {
  const [data, setData] = useState<any>(null);
  const [breakdown, setBreakdown] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async (breakdown?: string) => {
    setLoading(true);

    try {
      const url = breakdown
        ? `/api/dashboard/follower-demographics?breakdown=${breakdown}`
        : '/api/dashboard/follower-demographics';

      const res = await fetch(url);
      const json = await res.json();

      setData(json.followerDemographics);
      setLoading(false);
    } catch (err) {
      console.log('err: ', err);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const followerData = data?.follower_demographics?.total_value?.value || {};
  const breakdownLabels: Record<string, string> = {
    country: '국가',
    city: '도시',
    age: '연령대',
    gender: '성별',
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center max-md:p-5">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-4">
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
