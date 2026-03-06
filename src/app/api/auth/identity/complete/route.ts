import { NextResponse } from 'next/server';
import { AUTH_ERROR_CODES, AUTH_MESSAGES } from '@/constants/auth';

type IdentityCompleteRequestBody = {
  identityVerificationId?: string;
};

const BACKEND_API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL ?? 'https://devapi.popcon.store';

if (!BACKEND_API_BASE_URL) {
  throw new Error('BACKEND_API_BASE_URL is not set');
}

export async function POST(request: Request) {
  const body = (await request.json()) as IdentityCompleteRequestBody;
  const identityVerificationId = body.identityVerificationId?.trim();
  const deviceId = request.headers.get('X-Device-Id');
  const cookie = request.headers.get('cookie');

  if (!identityVerificationId) {
    return NextResponse.json(
      {
        code: AUTH_ERROR_CODES.COMMON.BAD_REQUEST,
        message: AUTH_MESSAGES.IDENTITY.ERROR.INVALID_INPUT,
        data: {
          ...(!identityVerificationId
            ? {
                identityVerificationId:
                  AUTH_MESSAGES.IDENTITY.ERROR.REQUIRED_ID,
              }
            : {}),
        },
      },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${BACKEND_API_BASE_URL}/auth/identity/complete`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(deviceId ? { 'X-Device-Id': deviceId } : {}),
          ...(cookie ? { Cookie: cookie } : {}),
        },
        body: JSON.stringify({
          identityVerificationId,
        }),
        cache: 'no-store',
      }
    );

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
