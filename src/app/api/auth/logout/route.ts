import { NextRequest } from 'next/server';
import {
  createServerErrorResponse,
  createUnauthorizedResponse,
  getServiceBaseUrl,
  handleProxyResponse,
} from '@/app/api/shared/route-helpers';

const API_BASE_URL = getServiceBaseUrl('auth');

export async function POST(request: NextRequest) {
  if (!API_BASE_URL) {
    return createServerErrorResponse();
  }

  const authorization = request.headers.get('Authorization');

  if (!authorization) {
    return createUnauthorizedResponse();
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        Authorization: authorization,
      },
      cache: 'no-store',
    });

    return handleProxyResponse(response, { withCookies: true });
  } catch (error) {
    console.error('[auth/logout]', error);
    return createServerErrorResponse();
  }
}
