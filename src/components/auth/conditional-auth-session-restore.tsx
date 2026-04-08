'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import AuthSessionRestore from './auth-session-restore';

const AUTH_PATHS = ['/signup', '/verify', '/callback'];

function SetUnauthenticated() {
  const clearAccessToken = useAuthStore((state) => state.clearAccessToken);
  useEffect(() => {
    clearAccessToken();
  }, [clearAccessToken]);
  return null;
}

export default function ConditionalAuthSessionRestore({ isLoggedIn }: { isLoggedIn: boolean }) {
  const pathname = usePathname();
  const isAuthPage = AUTH_PATHS.some((path) => pathname.startsWith(path));

  if (isAuthPage) return null;
  if (!isLoggedIn) return <SetUnauthenticated />;

  return <AuthSessionRestore />;
}
