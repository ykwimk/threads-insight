'use client';

import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <AlertTriangle className="mb-4 h-16 w-16 text-red-500" />
      <h1 className="mb-2 text-3xl font-bold text-gray-800">
        401 - 접근이 제한되었습니다
      </h1>
      <p className="mb-6 text-gray-600">
        유효한 세션이 없습니다. 로그인을 진행해 주세요.
      </p>
      <Button onClick={() => (window.location.href = '/api/threads/login')}>
        로그인 하러 가기
      </Button>
    </div>
  );
}
