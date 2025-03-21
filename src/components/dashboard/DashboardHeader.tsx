'use client';

import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { ProfileData } from '@/types';
import LogoutButton from '../common/LogoutButton';

interface Props {
  profile: ProfileData;
}

export default function DashboardHeader({ profile }: Props) {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (profile) {
      setLoading(false);
    }
  }, [profile]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white p-4 shadow-md dark:bg-gray-900">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-1">
        <div className="flex items-center gap-4">
          {loading ? (
            <Skeleton className="h-12 w-12 rounded-full" />
          ) : (
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={profile?.threads_profile_picture_url}
                alt="Profile Picture"
              />
              <AvatarFallback>
                {profile?.username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}
          <div>
            {loading ? (
              <>
                <Skeleton className="mb-2 h-5 w-32" />
                <Skeleton className="h-4 w-48" />
              </>
            ) : (
              <>
                <h1 className="text-lg font-bold">
                  {profile?.name || 'Unknown User'}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {profile?.threads_biography || 'No bio available'}
                </p>
              </>
            )}
          </div>
        </div>
        {/* 로그아웃 버튼 */}
        <LogoutButton />
      </div>
    </header>
  );
}
