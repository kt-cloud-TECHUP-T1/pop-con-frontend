'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import { RefreshTokenResponse } from '@/types/auth/auth';
import { LOGIN_REDIRECT_KEY } from '@/constants/auth';

const isValidRedirectPath = (value: string | null): value is string => {
  return typeof value === 'string' && value.startsWith('/');
};

export default function AuthCallbackPage() {
  const router = useRouter();
  const requestedRef = useRef(false);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setPaymentRegistered = useAuthStore(
    (state) => state.setPaymentRegistered
  );
  useEffect(() => {
    if (requestedRef.current) return;
    requestedRef.current = true;

    const refresh = async () => {
      try {
        const response = await fetch('/api/auth/token/refresh', {
          method: 'POST',
          cache: 'no-store',
        });

        const result: RefreshTokenResponse = await response.json();

        if (!response.ok) {
          router.replace(`/login?error=${result.code ?? 'S001'}`);
          return;
        }

        const accessToken = result.data?.accessToken ?? null;

        if (!accessToken) {
          router.replace('/login?error=S001');
          return;
        }

        setAccessToken(accessToken);

        try {
          const billingList = await getBillingList(accessToken);
          //간편결제 리스트 조회 결과로 등록여부 t/f판단
          setPaymentRegistered(billingList.length > 0);
        } catch (error: unknown) {
          console.error('[billing] error:', error);

          const errorCode = error instanceof Error ? error.message : 'UNKNOWN';

          if (errorCode === 'A002' || errorCode === 'A003') {
            setAccessToken(null);
            setPaymentRegistered(false);
            router.replace('/login');
            return;
          }

          setPaymentRegistered(false);
        }

        const redirect = sessionStorage.getItem(LOGIN_REDIRECT_KEY);
        sessionStorage.removeItem(LOGIN_REDIRECT_KEY);

        if (isValidRedirectPath(redirect)) {
          router.replace(redirect);
          return;
        }

        router.replace('/');
      } catch (error) {
        console.error('[AuthCallbackPage] refresh failed:', error);
        router.replace('/login?error=S001');
      }
    };

    refresh();
  }, [router, setAccessToken]);

  return <div>로그인 처리 중...</div>;
}
