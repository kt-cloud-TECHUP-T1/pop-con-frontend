'use client';

import { useEffect, type ReactNode } from 'react';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import { Button } from '@/components/ui/button';
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
    }
  }, [authStatus, clearAccessToken]);

  if (authStatus === 'loading') {
    return <div>로딩 중...</div>;
  }

  if (authStatus === 'unauthenticated') {
    return (
      <div>
        로그인 후 팝콘 서비스를 이용해보세요.{' '}
        <Button onClick={() => router.replace('/login')}>
          로그인 하러가기
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
