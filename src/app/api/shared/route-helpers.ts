import { NextResponse } from 'next/server';
import { API_ERROR_CODES, API_MESSAGES } from '@/constants/api';
import { AUTH_ERROR_CODES, AUTH_MESSAGES } from '@/constants/auth';

export function createUnauthorizedResponse() {
  return NextResponse.json(
    {
      code: AUTH_ERROR_CODES.AUTH.INVALID_AUTH,
      message: AUTH_MESSAGES.IDENTITY.ERROR.INVALID_AUTH,
      data: null,
    },
    { status: 401 }
  );
}

export function createBadRequestResponse(data: Record<string, string>) {
  return NextResponse.json(
    {
      code: API_ERROR_CODES.COMMON.BAD_REQUEST,
      message: API_MESSAGES.COMMON.INVALID_INPUT,
      data,
    },
    { status: 400 }
  );
}

export function createServerErrorResponse(message?: string) {
  return NextResponse.json(
    {
      code: API_ERROR_CODES.SYSTEM.INTERNAL_SERVER_ERROR,
      message: message ?? API_MESSAGES.COMMON.SERVER_ERROR,
      data: null,
    },
    { status: 500 }
  );
}

export function appendSetCookieHeaders(
  response: Response,
  nextResponse: NextResponse
) {
  if (typeof response.headers.getSetCookie !== 'function') {
    console.error('[appendSetCookieHeaders] getSetCookie는 지원되지 않습니다.');
    return;
  }

  response.headers.getSetCookie().forEach((value) => {
    nextResponse.headers.append('Set-Cookie', value);
  });
}

export async function safeParseResponseBody(response: Response) {
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

type HandleProxyResponseOptions = {
  withCookies?: boolean;
};

export async function handleProxyResponse(
  response: Response,
  options: HandleProxyResponseOptions = {}
): Promise<NextResponse> {
  if (response.status >= 500) {
    return createServerErrorResponse();
  }

  const body = await safeParseResponseBody(response);
  const nextResponse = NextResponse.json(body, { status: response.status });

  if (options.withCookies) {
    appendSetCookieHeaders(response, nextResponse);
  }

  return nextResponse;
}
