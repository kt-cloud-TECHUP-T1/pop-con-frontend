import { NextRequest } from 'next/server';
import { AUTH_MESSAGES } from '@/constants/auth';
import {
  createBadRequestResponse,
  createServerErrorResponse,
  getServiceBaseUrl,
  handleProxyResponse,
} from '@/app/api/shared/route-helpers';

const API_BASE_URL = getServiceBaseUrl('auth');

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get('refresh_token')?.value;

  if (!refreshToken) {
    return createBadRequestResponse({
      refreshToken: AUTH_MESSAGES.TOKEN.ERROR.REFRESH_TOKEN_REQUIRED,
    });
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/token/refresh`, {
      method: 'POST',
      headers: { Cookie: `refresh_token=${refreshToken}` },
      cache: 'no-store',
    });

    return handleProxyResponse(response, { withCookies: true });
  } catch (error) {
    console.error('[auth/token/refresh]', error);
    return createServerErrorResponse();
  }
}
