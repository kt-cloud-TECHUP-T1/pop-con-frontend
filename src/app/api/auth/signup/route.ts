import { NextRequest, NextResponse } from 'next/server';
import { API_ERROR_CODES, API_MESSAGES } from '@/constants/api';
import { AUTH_ERROR_CODES, AUTH_MESSAGES } from '@/constants/auth';

const NEXT_PUBLIC_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://devapi.popcon.store';

type SignupAgreements = {
  isPrivacyPolicyAgreed: boolean;
  isIdentifierPolicyAgreed: boolean;
  isServicePolicyAgreed: boolean;
  isMarketingAgreed?: boolean;
};

type SignupRequest = {
  agreements: SignupAgreements;
};

function createInvalidInputResponse(fieldErrors: Record<string, string>) {
  return NextResponse.json(
    {
      code: API_ERROR_CODES.COMMON.BAD_REQUEST,
      message: API_MESSAGES.COMMON.INVALID_INPUT,
      data: fieldErrors,
    },
    { status: 400 }
  );
}

function createSessionExpiredResponse() {
  return NextResponse.json(
    {
      code: AUTH_ERROR_CODES.AUTH.SESSION_EXPIRED,
      message: AUTH_MESSAGES.TERMS.ERROR.SESSION_EXPIRED,
      data: null,
    },
    { status: 401 }
  );
}

function validateSignupRequest(body: Partial<SignupRequest>) {
  const fieldErrors: Record<string, string> = {};

  if (!body.agreements || typeof body.agreements !== 'object') {
    fieldErrors['agreements.isPrivacyPolicyAgreed'] =
      AUTH_MESSAGES.TERMS.ERROR.REQUIRED_NOT_AGREED;
    fieldErrors['agreements.isIdentifierPolicyAgreed'] =
      AUTH_MESSAGES.TERMS.ERROR.REQUIRED_NOT_AGREED;
    fieldErrors['agreements.isServicePolicyAgreed'] =
      AUTH_MESSAGES.TERMS.ERROR.REQUIRED_NOT_AGREED;

    return fieldErrors;
  }

  if (body.agreements.isPrivacyPolicyAgreed !== true) {
    fieldErrors['agreements.isPrivacyPolicyAgreed'] =
      AUTH_MESSAGES.TERMS.ERROR.REQUIRED_NOT_AGREED;
  }

  if (body.agreements.isIdentifierPolicyAgreed !== true) {
    fieldErrors['agreements.isIdentifierPolicyAgreed'] =
      AUTH_MESSAGES.TERMS.ERROR.REQUIRED_NOT_AGREED;
  }

  if (body.agreements.isServicePolicyAgreed !== true) {
    fieldErrors['agreements.isServicePolicyAgreed'] =
      AUTH_MESSAGES.TERMS.ERROR.REQUIRED_NOT_AGREED;
  }

  return fieldErrors;
}

function appendSetCookieHeaders(
  response: Response,
  nextResponse: NextResponse
) {
  const setCookies =
    typeof response.headers.getSetCookie === 'function'
      ? response.headers.getSetCookie()
      : [];

  if (setCookies.length > 0) {
    setCookies.forEach((value) => {
      nextResponse.headers.append('Set-Cookie', value);
    });
    return;
  }

  // 예외 대비용 폴백
  const setCookie = response.headers.get('set-cookie');
  if (setCookie) {
    nextResponse.headers.append('Set-Cookie', setCookie);
  }
}

export async function POST(request: NextRequest) {
  const cookieHeader = request.headers.get('cookie');
  const registerToken = request.cookies.get('register_token')?.value;

  let body: SignupRequest;

  try {
    body = (await request.json()) as SignupRequest;
  } catch {
    return createInvalidInputResponse({
      'agreements.isPrivacyPolicyAgreed':
        AUTH_MESSAGES.TERMS.ERROR.REQUIRED_NOT_AGREED,
      'agreements.isIdentifierPolicyAgreed':
        AUTH_MESSAGES.TERMS.ERROR.REQUIRED_NOT_AGREED,
      'agreements.isServicePolicyAgreed':
        AUTH_MESSAGES.TERMS.ERROR.REQUIRED_NOT_AGREED,
    });
  }

  const fieldErrors = validateSignupRequest(body);

  if (Object.keys(fieldErrors).length > 0) {
    return createInvalidInputResponse(fieldErrors);
  }

  if (!registerToken) {
    return createSessionExpiredResponse();
  }

  try {
    const response = await fetch(`${NEXT_PUBLIC_API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      body: JSON.stringify({
        registerToken,
        agreements: body.agreements,
      }),
      cache: 'no-store',
    });

    const responseBody = await response.json();
    const nextResponse = NextResponse.json(responseBody, {
      status: response.status,
    });
    appendSetCookieHeaders(response, nextResponse);
    return nextResponse;
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        code: API_ERROR_CODES.SYSTEM.INTERNAL_SERVER_ERROR,
        message: API_MESSAGES.COMMON.SERVER_ERROR,
        data: null,
      },
      { status: 500 }
    );
  }
}
