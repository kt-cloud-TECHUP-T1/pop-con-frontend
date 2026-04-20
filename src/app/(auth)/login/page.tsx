// 로그인
'use client';
import { getBillingList } from '@/app/api/payment/get-billing-list';
import { getServiceBaseUrl } from '@/app/api/shared/route-helpers';
import { Icon } from '@/components/Icon/Icon';
import { Wrapper } from '@/components/layout/wrapper';
import { Button } from '@/components/ui/button';
import { snackbar } from '@/components/ui/snackbar';
import { Typography } from '@/components/ui/typography';
import { API_ERROR_CODES, API_MESSAGES } from '@/constants/api';
import {
  AUTH_ERROR_CODES,
  AUTH_MESSAGES,
  LOGIN_REDIRECT_KEY,
  SNACKBAR_KEY,
  SNACKBAR_MESSAGES,
  SUPER_ACCESS_TOKEN_KEY,
} from '@/constants/auth';
import { RADIUS } from '@/constants/design-system';
import { useLoginCollector } from '@/features/anti-macro';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import { SuperLoginResponse } from '@/types/auth/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

const API_BASE_URL = getServiceBaseUrl('auth');

const isValidAbsoluteUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

const ERROR_MESSAGE_MAP: Record<string, string> = {
  [API_ERROR_CODES.COMMON.BAD_REQUEST]: API_MESSAGES.COMMON.INVALID_INPUT,
  [AUTH_ERROR_CODES.AUTH.INVALID_AUTH]:
    AUTH_MESSAGES.IDENTITY.ERROR.INVALID_AUTH,
  [AUTH_ERROR_CODES.AUTH.SESSION_EXPIRED]: AUTH_MESSAGES.TOKEN.ERROR.EXPIRED,
  [API_ERROR_CODES.SYSTEM.INTERNAL_SERVER_ERROR]:
    API_MESSAGES.COMMON.SERVER_ERROR,
};
type SocialProvider = 'kakao' | 'naver';
const REDIRECT_DELAY = 1000;

const isValidRedirectPath = (value: string | null): value is string => {
  return (
    typeof value === 'string' &&
    value.startsWith('/') &&
    // 프로토콜 상대 URL(//evil.com) 및 백슬래시 기반 외부 리다이렉트 방지
    !value.startsWith('//') &&
    !value.includes('\\')
  );
};

export default function Login() {
  const router = useRouter();
  const params = useSearchParams();
  const errorCode = params.get('error');
  const redirect = params.get('redirect');
  const isSuperuserMode = params.get('superuser') === 'true';
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const clearAccessToken = useAuthStore((state) => state.clearAccessToken);
  const setPaymentRegistered = useAuthStore(
    (state) => state.setPaymentRegistered
  );
  const {
    submitSignals,
    honeypotProps,
    honeypotOverlayProps,
    honeypotWrapperProps,
  } = useLoginCollector();

  const socialLoginHandler = async (provider: SocialProvider) => {
    if (isLoggingIn) return;

    if (!API_BASE_URL || !isValidAbsoluteUrl(API_BASE_URL)) {
      snackbar.destructive({
        title: '설정 오류',
        description: 'API_BASE_URL 설정이 올바르지 않습니다.',
      });
      return;
    }
    setIsLoggingIn(true);

    // 안티매크로 시그널 전송 후 페이지 이동
    await submitSignals();

    window.location.href = `${API_BASE_URL}/auth/oauth/${provider}`;
  };

  const guestLoginHandler = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);

    try {
      const response = await fetch('/api/users/login/super', {
        method: 'POST',
        cache: 'no-store',
      });
      const result: SuperLoginResponse = await response.json();

      if (!response.ok || !result.data?.accessToken) {
        const code = result.code ?? 'S001';
        clearAccessToken();
        sessionStorage.setItem(
          SNACKBAR_KEY,
          JSON.stringify(SNACKBAR_MESSAGES.LOGIN_FAIL)
        );
        router.replace(`/login?superuser=true&error=${code}`);
        return;
      }

      const { accessToken } = result.data;
      sessionStorage.setItem(SUPER_ACCESS_TOKEN_KEY, accessToken);
      setAccessToken(accessToken);
      sessionStorage.setItem(
        SNACKBAR_KEY,
        JSON.stringify(SNACKBAR_MESSAGES.LOGIN_SUCCESS)
      );

      try {
        const billingList = await getBillingList(accessToken);
        setPaymentRegistered(billingList.length > 0);
      } catch {
        setPaymentRegistered(null);
      }

      const savedRedirect = sessionStorage.getItem(LOGIN_REDIRECT_KEY);
      sessionStorage.removeItem(LOGIN_REDIRECT_KEY);

      if (isValidRedirectPath(savedRedirect)) {
        router.replace(savedRedirect);
        return;
      }

      router.replace('/');
    } catch (error) {
      console.error('[guest-login] failed:', error);
      setIsLoggingIn(false);
      sessionStorage.setItem(
        SNACKBAR_KEY,
        JSON.stringify(SNACKBAR_MESSAGES.NETWORK_ERROR)
      );
      router.replace('/login?superuser=true&error=S001');
    }
  };

  const toLogin = useCallback(() => {
    setIsLoggingIn(false);
    router.replace(isSuperuserMode ? '/login?superuser=true' : '/login');
  }, [router, isSuperuserMode]);

  useEffect(() => {
    if (!redirect) return;

    sessionStorage.setItem(LOGIN_REDIRECT_KEY, redirect);
  }, [redirect]);

  useEffect(() => {
    if (!errorCode) return;

    const errorMessage =
      ERROR_MESSAGE_MAP[errorCode] ?? API_MESSAGES.COMMON.SERVER_ERROR;

    snackbar.destructive({
      title: '로그인실패',
      description: errorMessage,
      showCloseButton: true,
      duration: REDIRECT_DELAY,
      onClose: toLogin,
    });
    const timer = setTimeout(toLogin, REDIRECT_DELAY);

    return () => clearTimeout(timer);
  }, [errorCode, toLogin]);

  return (
    <Wrapper className="pt-[120px]">
      <Typography weight="bold" variant="heading-1" className="text-center">
        로그인
      </Typography>

      {/* 허니팟: 봇만 채우는 숨겨진 필드 */}
      <div {...honeypotWrapperProps}>
        <input {...honeypotProps} />
        <div {...honeypotOverlayProps} />
      </div>

      <div className="btn-group w-full max-w-[360px] mx-auto flex flex-col gap-3 pt-ml">
        {isSuperuserMode ? (
          <Button
            size="large"
            variant="primary"
            className={`w-full ${RADIUS.MS}`}
            disabled={isLoggingIn}
            onClick={guestLoginHandler}
          >
            <Typography
              variant="label-1"
              weight="medium"
              className="text-white"
            >
              게스트 로그인
            </Typography>
          </Button>
        ) : (
          <>
            <Button
              size="large"
              className={`w-full bg-[#FEE500] hover:bg-[#FEE500] active:bg-[#FEE500] disabled:bg-[#FEE500] disabled:text-[var(--content-high)] ${RADIUS.MS}`}
              leftIcon={
                <Icon
                  name="LogoKakao"
                  size={24}
                  className="text-[var(--content-high)]"
                ></Icon>
              }
              disabled={isLoggingIn}
              onClick={() => socialLoginHandler('kakao')}
            >
              <Typography
                variant="label-1"
                weight="medium"
                className="text-[var(--content-high)]"
              >
                카카오 로그인
              </Typography>
            </Button>
            <Button
              size="large"
              className={`w-full bg-[#03C75A] hover:bg-[#03C75A] active:bg-[#03C75A] disabled:bg-[#03C75A] disabled:text-white ${RADIUS.MS}`}
              leftIcon={<Icon name="LogoNaver" size={24}></Icon>}
              onClick={() => socialLoginHandler('naver')}
              disabled={isLoggingIn}
            >
              <Typography variant="label-1" weight="medium">
                네이버 로그인
              </Typography>
            </Button>
          </>
        )}
      </div>
    </Wrapper>
  );
}
