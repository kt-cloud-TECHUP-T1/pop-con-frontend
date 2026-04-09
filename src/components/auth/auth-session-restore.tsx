'use client';

import { useAuthStore } from '@/features/auth/stores/auth-store';
import { useEffect } from 'react';

export default function AuthSessionRestore() {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  useEffect(() => {
    const { accessToken } = useAuthStore.getState();

    if (accessToken) return;

    // [DEV ONLY] 로컬 작업용: 운영에서 복사한 accessToken을 localStorage에 넣어두면 사용
    if (process.env.NODE_ENV === 'development') {
      const devToken =
        typeof window !== 'undefined'
          ? window.localStorage.getItem('__dev_access_token')
          : null;
      if (devToken) {
        setAccessToken(devToken);
        return;
      }
    }

    const restoreSession = async () => {
      try {
        const response = await fetch('/api/auth/token/refresh', {
          method: 'POST',
        });

        if (!response.ok) return;

        const result = await response.json();
        if (result.data?.accessToken) {
          setAccessToken(result.data.accessToken);
        }
      } catch (error) {
        console.error(error);
      }
    };

    void restoreSession();
  }, [setAccessToken]);

  return null;
}
