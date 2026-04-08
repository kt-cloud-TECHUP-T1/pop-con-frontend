'use client';

import { usePathname } from 'next/navigation';
import AuthSessionRestore from './auth-session-restore';

const AUTH_PATHS = ['/signup', '/verify', '/callback'];

export default function ConditionalAuthSessionRestore({ isLoggedIn }: { isLoggedIn: boolean }) {
  const pathname = usePathname();
  const isAuthPage = AUTH_PATHS.some((path) => pathname.startsWith(path));

  if (isAuthPage || !isLoggedIn) return null;

  return <AuthSessionRestore />;
}
