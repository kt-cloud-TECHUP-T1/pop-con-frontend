import { NextResponse } from 'next/server';
import { AUTH_ERROR_CODES, AUTH_MESSAGES, AUTH_RESPONSE_CODE } from '@/constants/auth';

type IdentityVerificationResponse = {
  status: string;
  verifiedCustomer?: {
    id?: string;
    ci?: string;
    birthDate?: string;
    name?: string;
    phoneNumber?: string;
    gender?: string;
    isForeigner?: boolean;
  };
};

type IdentityCompleteRequestBody = {
  identityVerificationId?: string;
  registerToken?: string;
};

const PORTONE_API_BASE_URL = process.env.PORTONE_API_BASE_URL ?? 'https://api.portone.io';
const PORTONE_API_SECRET = process.env.PORTONE_API_SECRET;

function isAtLeast14(birthDate: string): boolean {
  const birth = new Date(birthDate);
  if (Number.isNaN(birth.getTime())) return false;

  const today = new Date();
  const cutoff = new Date(today.getFullYear() - 14, today.getMonth(), today.getDate());

  return birth <= cutoff;
}

function isExistingUserByCi(ci: string): boolean {
  // TODO: Replace with DB query (e.g. SELECT * FROM users WHERE ci = ?)
  const existingCiList = (process.env.MOCK_EXISTING_CI_LIST ?? '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  return existingCiList.includes(ci);
}

export async function POST(request: Request) {
  const body = (await request.json()) as IdentityCompleteRequestBody;
  const identityVerificationId = body.identityVerificationId?.trim();
  const registerToken = body.registerToken?.trim();

  if (!identityVerificationId || !registerToken) {
    return NextResponse.json(
      {
        code: AUTH_ERROR_CODES.COMMON.BAD_REQUEST,
        message: AUTH_MESSAGES.IDENTITY.ERROR.INVALID_INPUT,
        data: {
          ...(!identityVerificationId
            ? { identityVerificationId: AUTH_MESSAGES.IDENTITY.ERROR.REQUIRED_ID }
            : {}),
          ...(!registerToken
            ? { registerToken: AUTH_MESSAGES.IDENTITY.ERROR.REQUIRED_REGISTER_TOKEN }
            : {}),
        },
      },
      { status: 400 }
    );
  }

  if (registerToken === 'register_expired' || registerToken === 'register_missing') {
    return NextResponse.json(
      {
        code: AUTH_ERROR_CODES.AUTH.SESSION_EXPIRED,
        message: '회원가입 세션이 만료되었습니다. 다시 가입 절차를 진행해주세요.',
        data: null,
      },
      { status: 401 }
    );
  }

  if (!PORTONE_API_SECRET) {
    return NextResponse.json(
      {
        code: AUTH_ERROR_CODES.SYSTEM.INTERNAL_SERVER_ERROR,
        message: 'PORTONE_API_SECRET 환경변수가 설정되지 않았습니다.',
        data: null,
      },
      { status: 500 }
    );
  }

  try {
    const verificationResponse = await fetch(
      `${PORTONE_API_BASE_URL}/identity-verifications/${encodeURIComponent(identityVerificationId)}`,
      {
        headers: {
          Authorization: `PortOne ${PORTONE_API_SECRET}`,
        },
        cache: 'no-store',
      }
    );

    if (!verificationResponse.ok) {
      return NextResponse.json(
        {
          code: AUTH_ERROR_CODES.AUTH.INVALID_AUTH,
          message: AUTH_MESSAGES.IDENTITY.ERROR.INVALID_AUTH,
          data: null,
        },
        { status: 401 }
      );
    }

    const identityVerification =
      (await verificationResponse.json()) as IdentityVerificationResponse;

    if (identityVerification.status !== 'VERIFIED') {
      return NextResponse.json(
        {
          code: AUTH_ERROR_CODES.AUTH.INVALID_AUTH,
          message: AUTH_MESSAGES.IDENTITY.ERROR.INVALID_AUTH,
          data: null,
        },
        { status: 401 }
      );
    }

    const verifiedCustomer = identityVerification.verifiedCustomer;
    // Test env fallback: ci is not always provided, so we temporarily use verifiedCustomer.id.
    const ci = verifiedCustomer?.ci ?? verifiedCustomer?.id;
    const birthDate = verifiedCustomer?.birthDate;

    if (!ci || !birthDate) {
      const missingFields = [
        !ci ? 'ci(or id)' : null,
        !birthDate ? 'birthDate' : null,
      ].filter(Boolean);

      return NextResponse.json(
        {
          code: AUTH_ERROR_CODES.AUTH.INVALID_AUTH,
          message: `인증 정보 누락: ${missingFields.join(', ')}`,
          data: null,
        },
        { status: 422 }
      );
    }

    if (!isAtLeast14(birthDate)) {
      return NextResponse.json(
        {
          code: 'J001',
          message: AUTH_MESSAGES.IDENTITY.ERROR.UNDERAGE,
          data: null,
        },
        { status: 403 }
      );
    }

    const existingUser = isExistingUserByCi(ci);

    if (existingUser) {
      return NextResponse.json(
        {
          code: AUTH_RESPONSE_CODE.STATUS.SUCCESS,
          message: AUTH_MESSAGES.IDENTITY.SUCCESS.EXISTING_USER,
          data: {
            isNewUser: false,
            userId: 105,
            ci,
            birthDate,
            accessToken: `mock-access-${crypto.randomUUID()}`,
            refreshToken: `mock-refresh-${crypto.randomUUID()}`,
          },
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        code: AUTH_RESPONSE_CODE.STATUS.SUCCESS,
        message: AUTH_MESSAGES.IDENTITY.SUCCESS.NEW_USER,
        data: {
          isNewUser: true,
          nextStep: AUTH_RESPONSE_CODE.NEXT_STEP.TERMS,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        code: AUTH_ERROR_CODES.SYSTEM.INTERNAL_SERVER_ERROR,
        message: AUTH_MESSAGES.COMMON.ERROR.SERVER_ERROR,
        data: null,
      },
      { status: 500 }
    );
  }
}
