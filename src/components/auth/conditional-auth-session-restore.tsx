'use client';

import { usePathname } from 'next/navigation';
import AuthSessionRestore from './auth-session-restore';

const AUTH_PATHS = ['/login', '/signup', '/verify'];

export default function ConditionalAuthSessionRestore() {
  const pathname = usePathname();
  const isAuthPage = AUTH_PATHS.some((path) => pathname.startsWith(path));

  if (isAuthPage) return null;

  return <AuthSessionRestore />;
}
