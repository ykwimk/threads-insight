import { useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FollowerDemographicsData } from '@/types';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Button } from '../ui/button';
import LoadingSpinner from '../common/LoadingSpinner';
import { ScrollArea } from '../ui/scroll-area';
import { Card, CardContent, CardHeader } from '../ui/card';

interface Props {
  profileId: string;
}

export default function FollowerDemographicsSection({ profileId }: Props) {
  const [data, setData] = useState<FollowerDemographicsData[] | null>(null);
  const [breakdown, setBreakdown] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const breakdownLabels: Record<string, string> = {
    country: '국가',
    city: '도시',
    age: '연령대',
    gender: '성별',
  };

  const fetchData = async (breakdown?: string) => {
    setLoading(true);

    try {
      const res = await fetch(`/api/dashboard/follower-demographics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profileId, breakdown }),
      });
      const json = await res.json();

      if (res.ok) {
        setData(json.results.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const followerData = useMemo(() => {
    if (!data) return;
    return data[0].total_value.breakdowns[0].results;
  }, [data]);

  return (
    <div className="h-full overflow-auto p-6">
      <Card>
        <CardHeader>
          <div>
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
              <Button
                disabled={!breakdown}
                onClick={() => fetchData(breakdown)}
              >
                데이터 불러오기
              </Button>
            </div>
          </div>
        </CardHeader>
        {loading ? (
          <div className="flex items-center justify-center max-md:p-5">
            <LoadingSpinner />
          </div>
        ) : (
          breakdown &&
          followerData && (
            <CardContent>
              <div className="mt-4">
                {followerData.length > 0 ? (
                  <ScrollArea className="relative h-96 w-full rounded-md bg-white">
                    <Table className="relative">
                      <TableHeader className="sticky top-0 bg-white">
                        <TableRow>
                          <TableHead>{breakdownLabels[breakdown]}</TableHead>
                          <TableHead>팔로워 수</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="h-32">
                        {followerData.map((item, index) => {
                          const { dimension_values, value } = item;
                          return (
                            <TableRow key={index}>
                              <TableCell>{dimension_values[0]}</TableCell>
                              <TableCell>{String(value)}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                ) : (
                  <p className="text-gray-500">
                    해당 데이터를 불러올 수 없습니다.
                  </p>
                )}
              </div>
            </CardContent>
          )
        )}
      </Card>
    </div>
  );
}
