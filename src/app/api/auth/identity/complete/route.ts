import { NextResponse } from 'next/server';
import { API_ERROR_CODES, API_MESSAGES } from '@/constants/api';
import { AUTH_MESSAGES } from '@/constants/auth';

type IdentityCompleteRequestBody = {
  identityVerificationId?: string;
};

const NEXT_PUBLIC_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://devapi.popcon.store';

function createInvalidInputResponse() {
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

async function safeParseResponseBody(response: Response) {
  const responseText = await response.text();

  if (!responseText) {
    return {
      code: API_ERROR_CODES.SYSTEM.INTERNAL_SERVER_ERROR,
      message: API_MESSAGES.COMMON.SERVER_ERROR,
      data: null,
    };
  }

  try {
    return JSON.parse(responseText) as unknown;
  } catch {
    return {
      code: API_ERROR_CODES.SYSTEM.INTERNAL_SERVER_ERROR,
      message: API_MESSAGES.COMMON.SERVER_ERROR,
      data: null,
    };
  }
}

export async function POST(request: Request) {
  let identityVerificationId = '';
  const cookieHeader = request.headers.get('cookie');

  try {
    const body = (await request.json()) as IdentityCompleteRequestBody;
    identityVerificationId = body.identityVerificationId?.trim() ?? '';
  } catch {
    return createInvalidInputResponse();
  }

  if (!identityVerificationId) {
    return createInvalidInputResponse();
  }

  try {
    const response = await fetch(
      `${NEXT_PUBLIC_API_BASE_URL}/auth/identity/complete`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(cookieHeader ? { Cookie: cookieHeader } : {}),
        },
        body: JSON.stringify({
          identityVerificationId,
        }),
        cache: 'no-store',
      }
    );

    const responseBody = await safeParseResponseBody(response);
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
