'use client';

import { useEffect } from 'react';
import { ProfileData } from '@/types';
import UserInsightsSection from './user-insights/UserInsightsSection';
import MediaInsightsSection from './media-insights/MediaInsightsSection';
import FollowerDemographicsSection from './follower-demographics/FollowerDemographicsSection';
import { AnalyzeThreadsSection } from './analyze-threads/AnalyzeThreadsSection';

interface Props {
  profile: ProfileData;
}

export default function DashboardContainer({ profile }: Props) {
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
        {/* 사용자 쓰레드 분석 */}
        <AnalyzeThreadsSection
          username={profile.username}
          profileId={profile.id}
        />
        {/* 사용자 인사이트 */}
        <UserInsightsSection profileId={profile.id} />
        {/* 팔로워들의 인구 통계 정보 */}
        <FollowerDemographicsSection profileId={profile.id} />
        {/* 미디어 인사이트 */}
        <MediaInsightsSection profileId={profile.id} />
      </div>
    </main>
  );
}
