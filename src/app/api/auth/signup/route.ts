import { NextRequest, NextResponse } from 'next/server';
import { AUTH_ERROR_CODES, AUTH_MESSAGES } from '@/constants/auth';
import {
  createBadRequestResponse,
  createServerErrorResponse,
  handleProxyResponse,
} from '@/app/api/shared/route-helpers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, '');

type SignupAgreements = {
  isPrivacyPolicyAgreed: boolean;
  isIdentifierPolicyAgreed: boolean;
  isServicePolicyAgreed: boolean;
  isMarketingAgreed?: boolean;
};

type SignupRequest = {
  agreements: SignupAgreements;
};

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

export async function POST(request: NextRequest) {
  const cookieHeader = request.headers.get('cookie');
  const registerToken = request.cookies.get('register_token')?.value;

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    body = null;
  }

  if (!body || typeof body !== 'object') {
    return createBadRequestResponse({
      'agreements.isPrivacyPolicyAgreed':
        AUTH_MESSAGES.TERMS.ERROR.REQUIRED_NOT_AGREED,
      'agreements.isIdentifierPolicyAgreed':
        AUTH_MESSAGES.TERMS.ERROR.REQUIRED_NOT_AGREED,
      'agreements.isServicePolicyAgreed':
        AUTH_MESSAGES.TERMS.ERROR.REQUIRED_NOT_AGREED,
    });
  }

  const fieldErrors = validateSignupRequest(body as Partial<SignupRequest>);

  if (Object.keys(fieldErrors).length > 0) {
    return createBadRequestResponse(fieldErrors);
  }

  if (!registerToken) {
    return createSessionExpiredResponse();
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      body: JSON.stringify({
        registerToken,
        agreements: (body as Partial<SignupRequest>).agreements,
      }),
      cache: 'no-store',
    });

    return handleProxyResponse(response, { withCookies: true });
  } catch (error) {
    console.error('[auth/signup]', error);
    return createServerErrorResponse();
  }
}
