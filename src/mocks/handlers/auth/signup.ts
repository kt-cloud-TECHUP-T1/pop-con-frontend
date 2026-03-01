// JOIN-2000, JOIN-4000 약관 동의 및 가입 완료

import { http, HttpResponse } from 'msw';
import { generateMockToken } from '@/mocks/utils/token';
import {
  AUTH_ERROR_CODES,
  AUTH_MESSAGES,
  AUTH_RESPONSE_CODE,
} from '@/constants/auth';

export const signupHandler = http.post('/auth/signup', async ({ request }) => {
  const body = (await request.json()) as {
    registerToken?: string;
    agreements?: {
      isPrivacyPolicyAgreed?: boolean;
      isIdentifierPolicyAgreed?: boolean;
      isServicePolicyAgreed?: boolean;
      isMarketingAgreed?: boolean;
    };
  };

  // --------------------------------- //
  // ----------- 에러 케이스 ----------- //
  // ---- API 명세 순서대로 작성됐습니다 ---- //
  // --------------------------------- //

  // Case 4: 인증 정보가 유효하지 않음(토큰 오류)
  if (!body.registerToken) {
    return HttpResponse.json(
      {
        code: AUTH_ERROR_CODES.COMMON.BAD_REQUEST,
        message: AUTH_MESSAGES.IDENTITY.ERROR.INVALID_INPUT,
        data: {
          registerToken: AUTH_MESSAGES.IDENTITY.ERROR.REQUIRED_REGISTER_TOKEN,
        },
      },
      { status: 400 }
    );
  }

  const registerToken = body.registerToken.trim();
  const agreements = body.agreements;
  const agreementErrors: Record<string, string> = {};

  // Case 1: 입력값 오류(agreements 누락/타입 오류/필수 약관 false)
  if (!agreements || typeof agreements !== 'object') {
    return HttpResponse.json(
      {
        code: AUTH_ERROR_CODES.COMMON.BAD_REQUEST,
        message: AUTH_MESSAGES.IDENTITY.ERROR.INVALID_INPUT,
        data: {
          'aggrements.isPrivacyPolicyAgreed':
            AUTH_MESSAGES.TERMS.ERROR.REQUIRED_NOT_AGREED,
          'aggrements.isIdentifierPolicyAgreed':
            AUTH_MESSAGES.TERMS.ERROR.REQUIRED_NOT_AGREED,
          'aggrements.isServicePolicyAgreed':
            AUTH_MESSAGES.TERMS.ERROR.REQUIRED_NOT_AGREED,
        },
      },
      { status: 400 }
    );
  }

  if (agreements.isPrivacyPolicyAgreed !== true) {
    agreementErrors['aggrements.isPrivacyPolicyAgreed'] =
      AUTH_MESSAGES.TERMS.ERROR.REQUIRED_NOT_AGREED;
  }

  if (agreements.isIdentifierPolicyAgreed !== true) {
    agreementErrors['aggrements.isIdentifierPolicyAgreed'] =
      AUTH_MESSAGES.TERMS.ERROR.REQUIRED_NOT_AGREED;
  }

  if (agreements.isServicePolicyAgreed !== true) {
    agreementErrors['aggrements.isServicePolicyAgreed'] =
      AUTH_MESSAGES.TERMS.ERROR.REQUIRED_NOT_AGREED;
  }

  if (
    agreements.isMarketingAgreed !== undefined &&
    typeof agreements.isMarketingAgreed !== 'boolean'
  ) {
    agreementErrors['aggrements.isMarketingAgreed'] =
      'boolean 타입이어야 합니다.';
  }

  if (Object.keys(agreementErrors).length > 0) {
    return HttpResponse.json(
      {
        code: AUTH_ERROR_CODES.COMMON.BAD_REQUEST,
        message: AUTH_MESSAGES.IDENTITY.ERROR.INVALID_INPUT,
        data: agreementErrors,
      },
      { status: 400 }
    );
  }

  // Case 2: 이미 약관 동의 완료 회원
  if (registerToken === 'register_already_joined') {
    return HttpResponse.json(
      {
        code: AUTH_ERROR_CODES.COMMON.ALREADY_REGISTERED,
        message: AUTH_MESSAGES.TERMS.ERROR.ALREADY_REGISTERED,
        data: null,
      },
      { status: 409 }
    );
  }

  // Case 3: 회원 가입 세션 만료
  if (registerToken === 'register_expired') {
    return HttpResponse.json(
      {
        code: AUTH_ERROR_CODES.AUTH.SESSION_EXPIRED,
        message: AUTH_MESSAGES.TERMS.ERROR.SESSION_EXPIRED,
        data: null,
      },
      { status: 401 }
    );
  }

  // Case 5: 서버 오류
  if (registerToken === 'register_error') {
    return HttpResponse.json(
      {
        code: AUTH_ERROR_CODES.SYSTEM.INTERNAL_SERVER_ERROR,
        message: AUTH_MESSAGES.COMMON.ERROR.SERVER_ERROR,
        data: null,
      },
      { status: 500 }
    );
  }

  return HttpResponse.json(
    {
      code: AUTH_RESPONSE_CODE.STATUS.SUCCESS,
      message: AUTH_MESSAGES.TERMS.SUCCESS.JOIN_COMPLETED,
      data: {
        userId: 105,
        name: '홍길동',
        accessToken: generateMockToken('access', 105),
        refreshToken: generateMockToken('refresh', 105),
        joinedAt: new Date().toISOString(),
      },
    },
    { status: 200 }
  );
});
