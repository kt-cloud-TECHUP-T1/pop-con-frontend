'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import { RefreshTokenResponse } from '@/types/auth/auth';
import { LOGIN_REDIRECT_KEY } from '@/constants/auth';
import { getBillingList } from '@/app/api/payment/get-billing-list';
import { Wrapper } from '@/components/layout/wrapper';
import { Typography } from '@/components/ui/typography';
import { Spinner } from '@/components/sale-detail/ui/common/spinner';

const isValidRedirectPath = (value: string | null): value is string => {
  return typeof value === 'string' && value.startsWith('/');
};

export default function AuthCallbackPage() {
  const router = useRouter();
  const requestedRef = useRef(false);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const clearAccessToken = useAuthStore((state) => state.clearAccessToken);
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
          clearAccessToken();
          sessionStorage.setItem(
            'login_snackbar',
            JSON.stringify({
              type: 'error',
              title: '로그인 실패',
              description: '로그인 요청이 실패했습니다.',
            })
          );
          router.replace(`/login?error=${result.code ?? 'S001'}`);
          return;
        }

        const accessToken = result.data?.accessToken ?? null;
        //응답은 제대로 왔지만 서버에서 엑세스토큰을 실수로 안내려준 경우
        if (!accessToken) {
          clearAccessToken();
          sessionStorage.setItem(
            'login_snackbar',
            JSON.stringify({
              type: 'error',
              title: '로그인 실패',
              description: '인증 정보를 확인할 수 없습니다.',
            })
          );
          router.replace('/login?error=S001');
          return;
        }

        setAccessToken(accessToken);
        sessionStorage.setItem(
          'login_snackbar',
          //세션스토리지는 문자열만 저장가능 꺼내쓸때 파싱필요
          JSON.stringify({
            type: 'success',
            title: '로그인 성공',
            description: '환영합니다!',
          })
        );

        try {
          const billingList = await getBillingList(accessToken);
          //간편결제 리스트 조회 결과로 등록여부 t/f판단
          setPaymentRegistered(billingList.length > 0);
        } catch (error: unknown) {
          console.error('[billing] error:', error);

          const errorCode = error instanceof Error ? error.message : 'UNKNOWN';

          if (
            errorCode === 'A002' ||
            errorCode === 'A003' ||
            errorCode === 'U001'
          ) {
            //인증 깨짐 => 등록여부 및 로그인 비회원으로 바꿈
            clearAccessToken();
            sessionStorage.setItem(
              'login_snackbar',
              JSON.stringify({
                type: 'error',
                title: '로그인 실패',
                description: '인증에 문제가 발생했습니다. 다시 로그인해주세요.',
              })
            );
            router.replace('/login');
            return;
          }
          //시스템 에러인경우로 상태 확인 불가라서 null
          setPaymentRegistered(null);
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
        sessionStorage.setItem(
          'login_snackbar',
          JSON.stringify({
            type: 'error',
            title: '로그인 실패',
            description: '네트워크 오류가 발생했습니다.',
          })
        );
        router.replace('/login?error=S001');
      }
    };

    refresh();
  }, [router, setAccessToken, clearAccessToken, setPaymentRegistered]);

  return (
    <div>
      <Wrapper>
        <div className="flex flex-col justify-center items-center h-screen gap-l pb-40">
          <div className="flex flex-col justify-center items-center gap-xs">
            <Typography variant="heading-2" weight="medium">
              Pop Corn 에 오신걸 환영합니다.
            </Typography>
            <Typography
              variant="title-1"
              weight="regular"
              className="text-[var(--content-extra-low)]"
            >
              잠시만 기다려주세요.
            </Typography>
          </div>
          <Spinner size="xl" thickness="xl"></Spinner>
        </div>
      </Wrapper>
    </div>
  );
}
