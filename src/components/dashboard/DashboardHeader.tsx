'use client';

import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { ProfileResponseType } from '@/types';

export default function DashboardHeader() {
  const [profile, setProfile] = useState<ProfileResponseType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    setLoading(true);

    try {
      const res = await fetch('/api/profile');
      const json = await res.json();

      if (res.ok) {
        setProfile(json.profile);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white p-4 shadow-md dark:bg-gray-900">
      <div className="mx-auto flex max-w-3xl items-center gap-4">
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
    </header>
  );
}
