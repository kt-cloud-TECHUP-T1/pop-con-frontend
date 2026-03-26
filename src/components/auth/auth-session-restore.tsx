'use client';

import { useAuthStore } from '@/features/auth/stores/auth-store';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthSessionRestore() {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const pathname = usePathname();

  useEffect(() => {
    if (
      pathname.startsWith('/login') ||
      pathname.startsWith('/signup') ||
      pathname.startsWith('/verify')
    )
      return;

    const { accessToken } = useAuthStore.getState();

    if (accessToken) return;

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
  }, [setAccessToken, pathname]);

  return null;
}
