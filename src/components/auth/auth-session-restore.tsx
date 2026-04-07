'use client';

import { getBillingList } from '@/app/api/payment/get-billing-list';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import { useEffect, useRef } from 'react';

export default function AuthSessionRestore() {
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
  }, [setAccessToken, clearAccessToken, setAuthLoading, setPaymentRegistered]);

  return null;
}
