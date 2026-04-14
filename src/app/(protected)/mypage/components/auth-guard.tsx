'use client';

import { useEffect, type ReactNode } from 'react';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import { useRouter } from 'next/navigation';

type AuthGuardProps = {
  children: ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
  const authStatus = useAuthStore((state) => state.authStatus);
  const clearAccessToken = useAuthStore((state) => state.clearAccessToken);
  const router = useRouter();

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      clearAccessToken();
      router.replace('/login');
    }
  }, [authStatus, clearAccessToken, router]);

  if (authStatus === 'loading') {
    return <div>로딩 중...</div>;
  }

  if (authStatus === 'unauthenticated') {
    return null;
  }

  return <>{children}</>;
}
