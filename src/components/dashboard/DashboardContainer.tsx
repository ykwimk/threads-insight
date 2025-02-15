'use client';

import { useEffect } from 'react';
import UserInsightsSection from './UserInsightsSection';
import MediaInsightsSection from './MediaInsightsSection';
import FollowerDemographicsSection from './FollowerDemographicsSection';

export default function DashboardContainer() {
  useEffect(() => {
    if (window.location.hash === '#_') {
      history.replaceState(
        {},
        document.title,
        window.location.pathname + window.location.search,
      );
    }
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 max-md:p-5">
      <div className="w-full max-w-3xl max-md:block">
        {/* 사용자 인사이트 */}
        <UserInsightsSection />
        {/* 팔로워들의 인구 통계 정보 */}
        <FollowerDemographicsSection />
        {/* 미디어 인사이트 */}
        <MediaInsightsSection />
      </div>
    </main>
  );
}
