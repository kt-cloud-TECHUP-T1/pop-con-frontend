'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { RefreshTokenResponse } from '@/types/auth/auth';

export default function AuthCallbackPage() {
  const router = useRouter();
  const requestedRef = useRef(false);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  console.log('콜백페이지 실행');

  useEffect(() => {
    if (requestedRef.current) return;
    requestedRef.current = true;

    const refresh = async () => {
      try {
        const response = await fetch('/api/auth/token/refresh', {
          method: 'POST',
          cache: 'no-store',
        });

        const result: RefreshTokenResponse = await response.json();

        if (!response.ok) {
          router.replace(`/login?error=${result.code ?? 'S001'}`);
          return;
        }

        const accessToken = result.data?.accessToken ?? null;

        if (!accessToken) {
          router.replace('/login?error=S001');
          return;
        }

        setAccessToken(accessToken);
        router.replace('/');
      } catch (error) {
        console.error('[AuthCallbackPage] refresh failed:', error);
        router.replace('/login?error=S001');
      }
    };

    refresh();
  }, [router, setAccessToken]);

  return <div>로그인 처리 중...</div>;
}
