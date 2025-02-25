import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardContainer from '@/components/dashboard/DashboardContainer';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('threads_access_token')?.value;

  if (!accessToken) {
    return redirect('/error');
  }

  return (
    <>
      <DashboardHeader />
      <DashboardContainer />
    </>
  );
}
