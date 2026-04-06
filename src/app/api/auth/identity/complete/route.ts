import { NextRequest, NextResponse } from 'next/server';
import { AUTH_ERROR_CODES, AUTH_MESSAGES } from '@/constants/auth';
import {
  createBadRequestResponse,
  createServerErrorResponse,
  getServiceBaseUrl,
  handleProxyResponse,
} from '@/app/api/shared/route-helpers';

type IdentityCompleteRequestBody = {
  identityVerificationId?: string;
};

const API_BASE_URL = getServiceBaseUrl('auth');

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

export async function POST(request: NextRequest) {
  const cookieHeader = request.headers.get('cookie');
  const registerToken = request.cookies.get('register_token')?.value;
  let identityVerificationId = '';

  try {
    const body = (await request.json()) as IdentityCompleteRequestBody;
    identityVerificationId = body.identityVerificationId?.trim() ?? '';
  } catch {
    return createBadRequestResponse({
      identityVerificationId: AUTH_MESSAGES.IDENTITY.ERROR.REQUIRED_ID,
    });
  }

  if (!identityVerificationId) {
    return createBadRequestResponse({
      identityVerificationId: AUTH_MESSAGES.IDENTITY.ERROR.REQUIRED_ID,
    });
  }

  if (!registerToken) {
    return createSessionExpiredResponse();
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/identity/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      body: JSON.stringify({ identityVerificationId }),
      cache: 'no-store',
    });

    return handleProxyResponse(response, { withCookies: true });
  } catch (error) {
    console.error('[identity/complete]', error);
    return createServerErrorResponse();
  }
}
