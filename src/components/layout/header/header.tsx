'use client';

import { GuestHeader } from './guest-header';
import { MemberHeader } from './member-header';
import { useAuthSession } from '@/features/auth/hooks/use-auth-session';

export function Header() {
  const { isAuthenticated, isLoading } = useAuthSession();

  if (isLoading) {
    return null;
  }

  return isAuthenticated ? <MemberHeader /> : <GuestHeader />;
}
