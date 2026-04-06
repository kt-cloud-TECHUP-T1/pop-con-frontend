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

// ================================================================

const USE_LOCAL = process.env.NEXT_PUBLIC_USE_LOCAL_BACKEND === 'true';
const PROD_BASE = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, '');

const LOCAL_URLS = {
  auth: process.env.NEXT_PUBLIC_AUTH_API_URL,
  user: process.env.NEXT_PUBLIC_USER_API_URL,
  popup: process.env.NEXT_PUBLIC_POPUP_API_URL,
  auction: process.env.NEXT_PUBLIC_AUCTION_API_URL,
  draw: process.env.NEXT_PUBLIC_DRAW_API_URL,
  queue: process.env.NEXT_PUBLIC_QUEUE_API_URL,
};

export function getServiceBaseUrl(service: keyof typeof LOCAL_URLS) {
  const url = USE_LOCAL ? (LOCAL_URLS[service] ?? PROD_BASE) : PROD_BASE;
  return url?.replace(/\/+$/, '') ?? '';
}
