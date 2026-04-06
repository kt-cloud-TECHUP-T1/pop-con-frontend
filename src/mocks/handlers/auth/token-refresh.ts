// 토큰 재발급

import { http, HttpResponse } from 'msw';
import {
  API_ERROR_CODES,
  API_RESPONSE_CODE,
} from '@/constants/api';
import { generateMockToken, decodeMockToken } from '@/mocks/utils/token';
import {
  AUTH_ERROR_CODES,
  AUTH_MESSAGES,
} from '@/constants/auth';

type RefreshValidationResult = 'valid' | 'invalid' | 'expired';

const validateRefreshToken = (
  refreshToken: string
): RefreshValidationResult => {
  const decoded = decodeMockToken(refreshToken) as {
    type?: string;
    exp?: number;
    userId?: number;
  } | null;

  if (
    !decoded ||
    decoded.type !== 'refresh' ||
    typeof decoded.exp !== 'number'
  ) {
    return 'invalid';
  }

  const tokenParts = refreshToken.split('.');
  if (tokenParts.length !== 3 || !tokenParts[2]) {
    return 'invalid';
  }

  try {
    const signature = atob(tokenParts[2]);
    if (!signature.startsWith('mock-signature-refresh-')) {
      return 'invalid';
    }
  } catch {
    return 'invalid';
  }

  if (decoded.exp <= Math.floor(Date.now() / 1000)) {
    return 'expired';
  }

  return 'valid';
};

export const tokenRefreshHandler = http.post(
  '/auth/token/refresh',
  async ({ request }) => {
    let body: { refreshToken?: string } = {};

    try {
      body = (await request.json()) as { refreshToken?: string };
    } catch {
      body = {};
    }

    const refreshToken =
      typeof body.refreshToken === 'string' ? body.refreshToken.trim() : '';

    // --------------------------------- //
    // ----------- 에러 케이스 ----------- //
    // --------------------------------- //

    // Case 1: 입력값 오류(refreshToken 누락/빈값)
    if (!refreshToken) {
      return HttpResponse.json(
        {
          code: API_ERROR_CODES.COMMON.BAD_REQUEST,
          message: AUTH_MESSAGES.IDENTITY.ERROR.INVALID_INPUT,
          data: {
            refreshToken: AUTH_MESSAGES.TOKEN.ERROR.REFRESH_TOKEN_REQUIRED,
          },
        },
        { status: 400 }
      );
    }

    // Case 2: 인증 정보가 유효하지 않음(refreshToken 위조/서명 실패)
    if (refreshToken === 'refresh_invalid') {
      return HttpResponse.json(
        {
          code: AUTH_ERROR_CODES.AUTH.INVALID_AUTH,
          message: AUTH_MESSAGES.IDENTITY.ERROR.INVALID_AUTH,
          data: null,
        },
        { status: 401 }
      );
    }

    // Case 3: 인증 만료/세션 만료(refreshToken 만료 또는 폐기됨)
    if (
      refreshToken === 'refresh_expired' ||
      refreshToken === 'refresh_revoked'
    ) {
      return HttpResponse.json(
        {
          code: AUTH_ERROR_CODES.AUTH.LOGIN_REQUIRED,
          message: AUTH_MESSAGES.TOKEN.ERROR.EXPIRED,
          data: null,
        },
        { status: 401 }
      );
    }

    // Case 4: 서버 오류
    if (refreshToken === 'refresh_error') {
      return HttpResponse.json(
        {
          code: API_ERROR_CODES.SYSTEM.INTERNAL_SERVER_ERROR,
          message: AUTH_MESSAGES.TOKEN.ERROR.SERVER_ERROR_ON_SAVE,
          data: null,
        },
        { status: 500 }
      );
    }

    const validationResult = validateRefreshToken(refreshToken);

    if (validationResult === 'invalid') {
      return HttpResponse.json(
        {
          code: AUTH_ERROR_CODES.AUTH.INVALID_AUTH,
          message: AUTH_MESSAGES.IDENTITY.ERROR.INVALID_AUTH,
          data: null,
        },
        { status: 401 }
      );
    }

    if (validationResult === 'expired') {
      return HttpResponse.json(
        {
          code: AUTH_ERROR_CODES.AUTH.LOGIN_REQUIRED,
          message: AUTH_MESSAGES.TOKEN.ERROR.EXPIRED,
          data: null,
        },
        { status: 401 }
      );
    }

    // --------------------------------- //
    // ----------- 성공 케이스 ----------- //
    // --------------------------------- //

    // 성공: accessToken 재발급 + refreshToken 회전
    return HttpResponse.json(
      {
        code: API_RESPONSE_CODE.STATUS.SUCCESS,
        message: AUTH_MESSAGES.TOKEN.SUCCESS.REFRESHED,
        data: {
          accessToken: generateMockToken('access', 105),
          refreshToken: generateMockToken('refresh', 105),
          expiresIn: 3600,
        },
      },
      { status: 200 }
    );
  }
);
