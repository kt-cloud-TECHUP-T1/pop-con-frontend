import { NextResponse } from 'next/server';
import { AUTH_ERROR_CODES, AUTH_MESSAGES } from '@/constants/auth';
import { SignupRequest } from '@/types/api/auth';

const NEXT_PUBLIC_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://devapi.popcon.store';

if (!NEXT_PUBLIC_API_BASE_URL) {
  throw new Error('BACKEND_API_BASE_URL is not set');
}

function buildInvalidInputResponse(fieldErrors: Record<string, string>) {
  return NextResponse.json(
    {
      code: AUTH_ERROR_CODES.COMMON.BAD_REQUEST,
      message: AUTH_MESSAGES.IDENTITY.ERROR.INVALID_INPUT,
      data: fieldErrors,
    },
    { status: 400 }
  );
}

function validateSignupRequest(body: Partial<SignupRequest>) {
  const fieldErrors: Record<string, string> = {};

  if (!body.registerToken?.trim()) {
    fieldErrors.registerToken = AUTH_MESSAGES.IDENTITY.ERROR.REQUIRED_REGISTER_TOKEN;
  }

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

  if (
    body.agreements.isMarketingAgreed !== undefined &&
    typeof body.agreements.isMarketingAgreed !== 'boolean'
  ) {
    fieldErrors['agreements.isMarketingAgreed'] = 'boolean 타입이어야 합니다.';
  }

  return fieldErrors;
}

export async function POST(request: Request) {
  const deviceId = request.headers.get('X-Device-Id');
  const cookie = request.headers.get('cookie');

  let body: SignupRequest;

  try {
    body = (await request.json()) as SignupRequest;
  } catch {
    return buildInvalidInputResponse({
      registerToken: AUTH_MESSAGES.IDENTITY.ERROR.REQUIRED_REGISTER_TOKEN,
    });
  }

  const fieldErrors = validateSignupRequest(body);

  if (Object.keys(fieldErrors).length > 0) {
    return buildInvalidInputResponse(fieldErrors);
  }

  try {
    const response = await fetch(`${NEXT_PUBLIC_API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(deviceId ? { 'X-Device-Id': deviceId } : {}),
        ...(cookie ? { Cookie: cookie } : {}),
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const responseBody = await response.json();
    return NextResponse.json(responseBody, { status: response.status });
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
