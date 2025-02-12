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
    <div className="bg-gray-50">
      {/* 사용자 인사이트 */}
      <UserInsightsSection />
      {/* 팔로워들의 인구 통계 정보 */}
      <FollowerDemographicsSection />
      {/* 미디어 인사이트 */}
      <MediaInsightsSection />
    </div>
  );
}
