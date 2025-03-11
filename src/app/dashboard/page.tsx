import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardContainer from '@/components/dashboard/DashboardContainer';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { fetchProfileData } from '@/server';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(process.env.SERVICE_ACCESS_TOKEN!)?.value;
  const userId = cookieStore.get(process.env.SERVICE_USER_ID!)?.value;

  if (!accessToken || !userId) {
    return redirect('/error');
  }

  const profile = await fetchProfileData(accessToken);

  if (!profile || 'error' in profile) {
    return redirect('/error');
  }

  return (
    <>
      <DashboardHeader profile={profile} />
      <DashboardContainer profile={profile} />
    </>
  );
}
