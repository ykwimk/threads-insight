'use client';

import { useEffect, useState } from 'react';
import UserInsightsSection from './UserInsightsSection';
import MediaInsightsSection from './MediaInsightsSection';

export default function ThreadsInsightsDashboard() {
  const [data, setData] = useState<any>(null);
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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 max-md:p-5">
        <p>Loading...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 max-md:p-5">
        <p>No data available.</p>
      </div>
    );
  }

  return (
    <div>
      {/* 사용자 인사이트 */}
      <UserInsightsSection data={data} fetchData={fetchData} />
      {/* 미디어 인사이트 */}
      <MediaInsightsSection data={dummyData} />
    </div>
  );
}
