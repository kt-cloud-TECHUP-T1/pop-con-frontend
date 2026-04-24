'use client';

import { getBillingList } from '@/app/api/payment/get-billing-list';
import { SUPER_ACCESS_TOKEN_KEY } from '@/constants/auth';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import { useEffect, useRef } from 'react';

export default function AuthSessionRestore({
  isLoggedIn,
}: {
  isLoggedIn: boolean;
}) {
  const requestedRef = useRef(false);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const clearAccessToken = useAuthStore((state) => state.clearAccessToken);
  const setAuthLoading = useAuthStore((state) => state.setAuthLoading);
  const setPaymentRegistered = useAuthStore(
    (state) => state.setPaymentRegistered
  );

  useEffect(() => {
    if (requestedRef.current) return;
    requestedRef.current = true;

    const { accessToken } = useAuthStore.getState();

    if (accessToken) return;

    // [DEV ONLY] 로컬 작업용: 운영에서 복사한 accessToken을 localStorage에 넣어두면 사용
    if (process.env.NODE_ENV === 'development') {
      const devToken =
        typeof window !== 'undefined'
          ? window.localStorage.getItem('__dev_access_token')
          : null;
      if (devToken) {
        setAccessToken(devToken);
        return;
      }
    }

    // 슈퍼(시연) 계정 세션: sessionStorage에 저장된 accessToken 복구
    const superToken =
      typeof window !== 'undefined'
        ? window.sessionStorage.getItem(SUPER_ACCESS_TOKEN_KEY)
        : null;
    if (superToken) {
      setAccessToken(superToken);
      void (async () => {
        try {
          const billingList = await getBillingList(superToken);
          setPaymentRegistered(billingList.length > 0);
        } catch {
          setPaymentRegistered(null);
        }
      })();
      return;
    }

    // refresh_token 쿠키 부재 시 refresh 호출 스킵
    if (!isLoggedIn) {
      clearAccessToken();
      return;
    }

    const restoreSession = async () => {
      setAuthLoading();

      try {
        const response = await fetch('/api/auth/token/refresh', {
          method: 'POST',
          cache: 'no-store',
        });

        if (!response.ok) {
          clearAccessToken();
          if (process.env.NODE_ENV === 'development') {
            console.log(
              '[auth-session-restore] 세션 복원 실패 - status:',
              response.status
            );
          }
          return;
        }

        const result = await response.json();
        const accessToken = result.data?.accessToken;

        if (!accessToken) {
          clearAccessToken();
          return;
        }

        setAccessToken(accessToken);

        try {
          const billingList = await getBillingList(accessToken);
          setPaymentRegistered(billingList.length > 0);
        } catch (error: unknown) {
          console.error('[billing] error:', error);

          const errorCode = error instanceof Error ? error.message : 'UNKNOWN';

          // 인증 에러 → 로그아웃
          if (errorCode === 'A002' || errorCode === 'A003') {
            clearAccessToken();
            setPaymentRegistered(false);
            return;
          }

          setPaymentRegistered(false);
        }
      } catch (error) {
        console.error('[AuthSessionRestore] restore failed:', error);
        clearAccessToken();
      }
    };

    void restoreSession();
  }, [
    isLoggedIn,
    setAccessToken,
    clearAccessToken,
    setAuthLoading,
    setPaymentRegistered,
  ]);

  return null;
}
