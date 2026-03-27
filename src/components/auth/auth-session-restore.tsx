'use client';

import { useAuthStore } from '@/features/auth/stores/auth-store';
import { useEffect, useRef } from 'react';

export default function AuthSessionRestore() {
  const requestedRef = useRef(false);

  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const clearAccessToken = useAuthStore((state) => state.clearAccessToken);
  const setAuthLoading = useAuthStore((state) => state.setAuthLoading);

  useEffect(() => {
    if (requestedRef.current) return;
    requestedRef.current = true;

    const { accessToken } = useAuthStore.getState();

    if (accessToken) return;

    const restoreSession = async () => {
      setAuthLoading();

      try {
        const response = await fetch('/api/auth/token/refresh', {
          method: 'POST',
          cache: 'no-store',
        });

        if (!response.ok) {
          clearAccessToken();
          return;
        }

        const result = await response.json();
        const accessToken = result.data?.accessToken;

        if (!accessToken) {
          clearAccessToken();
          return;
        }

        setAccessToken(accessToken);
      } catch (error) {
        console.error('[AuthSessionRestore] restore failed:', error);
        clearAccessToken();
      }
    };

    void restoreSession();
  }, [setAccessToken, clearAccessToken, setAuthLoading]);

  return null;
}
