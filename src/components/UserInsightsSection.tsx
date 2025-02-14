import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { UserInsightsDataType, UserInsightsValueType } from '@/types';
import DashboardCard from './DashboardCard';
import LoadingSpinner from './LoadingSpinner';

const ChartComponent = dynamic(() => import('./Chart'), { ssr: false });

export default function UserInsightsSection() {
  const [data, setData] = useState<Array<UserInsightsDataType>>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);

    try {
      const res = await fetch('/api/dashboard/user-insights');
      const json = await res.json();

      if (res.ok) {
        setData(json.userInsights);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const profileViews = useMemo(() => {
    const views = data.find((insight) => insight.name === 'views');

    if (!views?.values) return [];

    return views.values.map((entry: UserInsightsValueType) => ({
      date: entry.end_time?.split('T')[0],
      views: entry.value,
    }));
  }, [data]);

  const getInsightsByName = (metrics: string) => {
    if (!data) return;
    return data.find((insight) => insight.name === metrics);
  };

  const views = getInsightsByName('views');
  const likes = getInsightsByName('likes');
  const replies = getInsightsByName('replies');
  const followersCount = getInsightsByName('followers_count');

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center max-md:p-5">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
        <DashboardCard
          title={views?.title ?? '총 조회수'}
          description={views?.description}
          value={views?.total_value?.value || 0}
        />
        <DashboardCard
          title={likes?.title ?? '총 좋아요수'}
          description={likes?.description}
          value={likes?.total_value?.value || 0}
        />
        <DashboardCard
          title={replies?.title ?? '총 리플'}
          description={replies?.description}
          value={replies?.total_value?.value || 0}
        />
        <DashboardCard
          title={followersCount?.title ?? '팔로워 수'}
          description={followersCount?.description}
          value={followersCount?.total_value?.value || 0}
        />
      </div>
      {/* 프로필 조회수 변화 */}
      <div className="mt-8">
        <h2 className="mb-4 text-xl font-bold">프로필 조회수 변화</h2>
        <ChartComponent data={profileViews} />
      </div>
    </div>
  );
}
