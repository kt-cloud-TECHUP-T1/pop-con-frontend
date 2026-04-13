import {
  createUnauthorizedResponse,
  createServerErrorResponse,
  handleProxyResponse,
  getServiceBaseUrl,
} from '@/app/api/shared/route-helpers';

const API_BASE_URL = getServiceBaseUrl('draw');

export async function GET(request: Request) {
  if (!API_BASE_URL) {
    return createServerErrorResponse();
  }

  const authorization = request.headers.get('Authorization');

  if (!authorization) {
    return createUnauthorizedResponse();
  }

  try {
    const response = await fetch(`${API_BASE_URL}/history/draws`, {
      method: 'GET',
      headers: {
        Authorization: authorization,
      },
      cache: 'no-store',
    });

    return handleProxyResponse(response);
  } catch (error) {
    console.error('[GET /api/history/draws]', error);
    return createServerErrorResponse();
  }
}
