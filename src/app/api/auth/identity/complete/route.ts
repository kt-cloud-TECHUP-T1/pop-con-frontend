import { NextResponse } from 'next/server';
import { API_ERROR_CODES, API_MESSAGES } from '@/constants/api';
import { AUTH_MESSAGES } from '@/constants/auth';

type IdentityCompleteRequestBody = {
  identityVerificationId?: string;
};

const NEXT_PUBLIC_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://devapi.popcon.store';

export async function POST(request: Request) {
  let identityVerificationId = '';
  const deviceId = request.headers.get('X-Device-Id');
  const cookie = request.headers.get('cookie');

  try {
    const body = (await request.json()) as IdentityCompleteRequestBody;
    identityVerificationId = body.identityVerificationId?.trim() ?? '';
  } catch {
    return NextResponse.json(
      {
        code: API_ERROR_CODES.COMMON.BAD_REQUEST,
        message: API_MESSAGES.COMMON.INVALID_INPUT,
        data: {
          identityVerificationId: AUTH_MESSAGES.IDENTITY.ERROR.REQUIRED_ID,
        },
      },
      { status: 400 }
    );
  }

  if (!identityVerificationId) {
    return NextResponse.json(
      {
        code: API_ERROR_CODES.COMMON.BAD_REQUEST,
        message: API_MESSAGES.COMMON.INVALID_INPUT,
        data: {
          identityVerificationId: AUTH_MESSAGES.IDENTITY.ERROR.REQUIRED_ID,
        },
      },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${NEXT_PUBLIC_API_BASE_URL}/auth/identity/complete`,
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
        code: API_ERROR_CODES.SYSTEM.INTERNAL_SERVER_ERROR,
        message: API_MESSAGES.COMMON.SERVER_ERROR,
        data: null,
      },
      { status: 500 }
    );
  }
}
