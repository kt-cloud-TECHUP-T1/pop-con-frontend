'use client';

import { usePathname } from 'next/navigation';
import AuthSessionRestore from './auth-session-restore';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import { useEffect } from 'react';

const AUTH_PATHS = ['/signup', '/verify', '/callback'];

export default function ConditionalAuthSessionRestore({
  isLoggedIn,
}: {
  isLoggedIn: boolean;
}) {
  const pathname = usePathname();
  const clearAccessToken = useAuthStore((state) => state.clearAccessToken);

  const isAuthPage = AUTH_PATHS.some((path) => pathname.startsWith(path));

  useEffect(() => {
    if (!isAuthPage && !isLoggedIn) {
      clearAccessToken();
    }
  }, [isAuthPage, isLoggedIn, clearAccessToken]);

  if (isAuthPage || !isLoggedIn) return null;

  return <AuthSessionRestore />;
}
