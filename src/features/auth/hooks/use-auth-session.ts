'use client';

import { useEffect, useState } from 'react';
import {
  AUTH_CHANGE_EVENT_NAME,
  hasAccessToken,
} from '@/features/auth/utils/auth-storage';

export function useAuthSession() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const syncAuthState = () => {
      setIsAuthenticated(hasAccessToken());
      setIsLoading(false);
    };

    syncAuthState();

    window.addEventListener('storage', syncAuthState);
    window.addEventListener(AUTH_CHANGE_EVENT_NAME, syncAuthState);

    return () => {
      window.removeEventListener('storage', syncAuthState);
      window.removeEventListener(AUTH_CHANGE_EVENT_NAME, syncAuthState);
    };
  }, []);

  return {
    isAuthenticated,
    isLoading,
  };
}
