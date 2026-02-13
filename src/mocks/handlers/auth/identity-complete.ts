// JOIN-1001 본인인증 완료(토큰 발급)

import { http, HttpResponse } from 'msw';
import { generateMockToken } from '@/mocks/utils/token';
import {
  AUTH_ERROR_CODES,
  AUTH_MESSAGES,
  AUTH_RESPONSE_CODE,
} from '@/constants/auth';

export const identityCompleteHandler = http.post(
  '/auth/identity/complete',
  async ({ request }) => {
    const body = (await request.json()) as { identityVerificationId?: string };

    // --------------------------------- //
    // ----------- 에러 케이스 ----------- //
    // --------------------------------- //

    // Case 1: 입력값 오류(agreements 누락/타입 오류/필수 약관 false)
    if (!body.identityVerificationId) {
      return HttpResponse.json(
        {
          code: AUTH_ERROR_CODES.COMMON.BAD_REQUEST,
          message: AUTH_MESSAGES.IDENTITY.ERROR.INVALID_INPUT,
          data: {
            identityVerificationId: AUTH_MESSAGES.IDENTITY.ERROR.REQUIRED_ID,
          },
        },
        { status: 400 }
      );
    }

    const { identityVerificationId } = body;

    // Case 2: 만 14세 미만 (테스트용 특정 ID)
    if (identityVerificationId === 'iv_underage') {
      return HttpResponse.json(
        {
          code: AUTH_ERROR_CODES.COMMON.ALREADY_REGISTERED,
          message: AUTH_MESSAGES.IDENTITY.ERROR.UNDERAGE,
          data: null,
        },
        { status: 403 }
      );
    }

    // Case 3: 인증 정보 유효하지 않음
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

    // Case 4: 서버 오류
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

    // --------------------------------- //
    // ----------- 성공 케이스 ----------- //
    // --------------------------------- //

    // 성공 케이스 - 신규 회원 (기본값)
    if (identityVerificationId.startsWith('iv_new')) {
      return HttpResponse.json(
        {
          code: AUTH_RESPONSE_CODE.STATUS.SUCCESS,
          message: AUTH_MESSAGES.IDENTITY.SUCCESS.NEW_USER,
          data: {
            isNewUser: true,
            registerToken: generateMockToken('register'),
            nextStep: AUTH_RESPONSE_CODE.NEXT_STEP.TERMS,
            expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
          },
        },
        { status: 200 }
      );
    }

    // 성공 케이스 - 기존 회원
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
