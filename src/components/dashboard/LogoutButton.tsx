import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);

    try {
      const res = await fetch('/api/threads/logout');
      const json = await res.json();

      if (res.ok) {
        router.push('/');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={fetchData} disabled={loading}>
      {loading ? '로그아웃 중...' : '로그아웃'}
    </Button>
  );
}
