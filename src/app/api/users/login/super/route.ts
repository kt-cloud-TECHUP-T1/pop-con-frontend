import {
  createServerErrorResponse,
  getServiceBaseUrl,
  handleProxyResponse,
} from '@/app/api/shared/route-helpers';

const API_BASE_URL = getServiceBaseUrl('user');

export async function POST() {
  if (!API_BASE_URL) {
    return createServerErrorResponse();
  }

  try {
    const response = await fetch(`${API_BASE_URL}/users/login/super`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    return handleProxyResponse(response, { withCookies: true });
  } catch (error) {
    console.error('[users/login/super]', error);
    return createServerErrorResponse();
  }
}
