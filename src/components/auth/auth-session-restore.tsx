'use client';

import { useAuthStore } from '@/features/auth/stores/auth-store';
import { useEffect } from 'react';

export default function AuthSessionRestore() {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  useEffect(() => {
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
  }, [setAccessToken]);

  return null;
}
