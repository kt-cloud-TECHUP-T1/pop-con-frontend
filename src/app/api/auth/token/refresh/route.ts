import { API_ERROR_CODES, API_MESSAGES } from '@/constants/api';
import { AUTH_MESSAGES } from '@/constants/auth';
import { NextRequest, NextResponse } from 'next/server';

const NEXT_PUBLIC_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://devapi.popcon.store';

function createInvalidInputResponse() {
  return NextResponse.json(
    {
      code: API_ERROR_CODES.COMMON.BAD_REQUEST,
      message: API_MESSAGES.COMMON.INVALID_INPUT,
      data: {
        refreshToken: AUTH_MESSAGES.TOKEN.ERROR.REFRESH_TOKEN_REQUIRED,
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

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get('refresh_token')?.value;

  if (!refreshToken) {
    return createInvalidInputResponse();
  }

  try {
    const response = await fetch(
      `${NEXT_PUBLIC_API_BASE_URL}/auth/token/refresh`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken,
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
