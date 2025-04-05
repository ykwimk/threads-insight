import { useCallback, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { UserInsightsData, UserInsightsValues } from '@/types';
import useAbortController from '@/hooks/useAbortController';
import UserInsightsCard from './UserInsightsCard';
import LoadingSpinner from '../../common/LoadingSpinner';

const ChartComponent = dynamic(() => import('../../common/Chart'), {
  ssr: false,
});

interface Props {
  profileId: string;
}

export default function UserInsightsSection({ profileId }: Props) {
  const getSignal = useAbortController();

  const [data, setData] = useState<Array<UserInsightsData>>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      const signal = getSignal();

      const res = await fetch('/api/dashboard/user-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profileId }),
        signal,
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
  }, [profileId, getSignal]);

  const profileViews = useMemo(() => {
    const views = data.find((insight) => insight.name === 'views');

    if (!views?.values) return [];

    return views.values.map((entry: UserInsightsValues) => ({
      date: entry.end_time?.split('T')[0],
      views: entry.value,
    }));
  }, [data]);

  const getInsightsByName = (metrics: string) => {
    if (!data) return;
    return data.find((insight) => insight.name === metrics);
  };

  const likes = getInsightsByName('likes');
  const replies = getInsightsByName('replies');
  const followersCount = getInsightsByName('followers_count');
  const reposts = getInsightsByName('reposts');

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
        <UserInsightsCard
          title={followersCount?.title ?? '팔로워 수'}
          description={followersCount?.description}
          value={followersCount?.total_value?.value || 0}
        />
        <UserInsightsCard
          title={reposts?.title ?? '총 리포스트수'}
          description={reposts?.description}
          value={reposts?.total_value?.value || 0}
        />
        <UserInsightsCard
          title={likes?.title ?? '총 좋아요수'}
          description={likes?.description}
          value={likes?.total_value?.value || 0}
        />
        <UserInsightsCard
          title={replies?.title ?? '총 리플'}
          description={replies?.description}
          value={replies?.total_value?.value || 0}
        />
      </div>
      {/* 프로필 조회수 변화 */}
      <div className="mt-8">
        <h2 className="mb-4 text-xl font-bold">프로필 조회수 변화</h2>
        <ChartComponent data={profileViews} nameKey="조회수" />
      </div>
    </div>
  );
}
