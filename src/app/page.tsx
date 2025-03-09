import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import HomeContainer from '@/components/home/HomeContainer';

export default async function Home() {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get(process.env.SERVICE_ACCESS_TOKEN!)?.value;
  const userId = cookieStore.get(process.env.SERVICE_USER_ID!)?.value;

  if (accessToken && userId) {
    return redirect('/dashboard');
  }

  return <HomeContainer />;
}
