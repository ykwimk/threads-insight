import { useEffect, useState } from 'react';
import { UserInsightsDataType } from '@/types';
import DashboardCard from './DashboardCard';

export default function UserInsightsSection() {
  const [data, setData] = useState<Array<UserInsightsDataType>>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);

    try {
      const res = await fetch('/api/dashboard/user-insights');
      const json = await res.json();

      setData(json.userInsights);
      setLoading(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
      <div className="flex min-h-screen items-center justify-center max-md:p-5">
        <p>Loading...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center max-md:p-5">
        <p>No data available.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-4">
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
  );
}
