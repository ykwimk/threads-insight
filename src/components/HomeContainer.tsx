'use client';

import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

export default function HomeContainer() {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/api/threads/login');
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 max-md:p-5">
      <section className="text-center">
        <h1 className="mb-4 text-2xl font-semibold">
          Welcome to Meta Threads Insight!
        </h1>
        <p className="mb-4">
          로그인한 계정의 Threads 정보를 한눈에 확인해 보세요.
        </p>
        <Button onClick={handleLogin}>시작하기</Button>
      </section>
    </main>
  );
}
