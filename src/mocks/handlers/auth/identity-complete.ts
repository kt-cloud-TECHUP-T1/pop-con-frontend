// JOIN-1001 본인인증 완료

import { http, HttpResponse } from 'msw';
import { generateMockToken } from '@/mocks/utils/token';
import {
  AUTH_ERROR_CODES,
  AUTH_MESSAGES,
  AUTH_RESPONSE_CODE,
} from '@/constants/auth';

export const identityCompleteHandler = http.post(
  '/api/auth/identity/complete',
  async ({ request, cookies }) => {
    const body = (await request.json()) as {
      identityVerificationId?: string;
    };

    const identityVerificationId = body.identityVerificationId?.trim();
    const registerToken =
      cookies.register_token ?? cookies.registerToken;

    if (!identityVerificationId) {
      return HttpResponse.json(
        {
          code: AUTH_ERROR_CODES.COMMON.BAD_REQUEST,
          message: AUTH_MESSAGES.IDENTITY.ERROR.INVALID_INPUT,
          data: {
            ...(!identityVerificationId
              ? { identityVerificationId: AUTH_MESSAGES.IDENTITY.ERROR.REQUIRED_ID }
              : {}),
          },
        },
        { status: 400 }
      );
    }

    if (!registerToken) {
      return HttpResponse.json(
        {
          code: AUTH_ERROR_CODES.AUTH.SESSION_EXPIRED,
          message: '회원가입 세션이 만료되었습니다. 다시 가입 절차를 진행해주세요.',
          data: null,
        },
        { status: 401 }
      );
    }

    if (registerToken === 'register_expired' || registerToken === 'register_missing') {
      return HttpResponse.json(
        {
          code: AUTH_ERROR_CODES.AUTH.SESSION_EXPIRED,
          message: '회원가입 세션이 만료되었습니다. 다시 가입 절차를 진행해주세요.',
          data: null,
        },
        { status: 401 }
      );
    }

    if (identityVerificationId === 'iv_underage') {
      return HttpResponse.json(
        {
          code: 'J001',
          message: AUTH_MESSAGES.IDENTITY.ERROR.UNDERAGE,
          data: null,
        },
        { status: 403 }
      );
    }

    if (identityVerificationId === 'iv_invalid') {
      return HttpResponse.json(
        {
          code: AUTH_ERROR_CODES.AUTH.INVALID_AUTH,
          message: AUTH_MESSAGES.IDENTITY.ERROR.INVALID_AUTH,
          data: null,
        },
        { status: 401 }
      );
    }

    if (identityVerificationId === 'iv_error') {
      return HttpResponse.json(
        {
          code: AUTH_ERROR_CODES.SYSTEM.INTERNAL_SERVER_ERROR,
          message: AUTH_MESSAGES.COMMON.ERROR.SERVER_ERROR,
          data: null,
        },
        { status: 500 }
      );
    }

    if (identityVerificationId.startsWith('iv_new')) {
      return HttpResponse.json(
        {
          code: AUTH_RESPONSE_CODE.STATUS.SUCCESS,
          message: AUTH_MESSAGES.IDENTITY.SUCCESS.NEW_USER,
          data: {
            isNewUser: true,
            nextStep: AUTH_RESPONSE_CODE.NEXT_STEP.TERMS,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
          },
        },
        { status: 200 }
      );
    }

    return HttpResponse.json(
      {
        code: AUTH_RESPONSE_CODE.STATUS.SUCCESS,
        message: AUTH_MESSAGES.IDENTITY.SUCCESS.EXISTING_USER,
        data: {
          isNewUser: false,
          userId: 105,
          accessToken: generateMockToken('access', 105),
          refreshToken: generateMockToken('refresh', 105),
        },
      },
      { status: 200 }
    );
  }
);
