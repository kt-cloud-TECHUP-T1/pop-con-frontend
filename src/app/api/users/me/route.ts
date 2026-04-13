import {
  createServerErrorResponse,
  createUnauthorizedResponse,
  getServiceBaseUrl,
  handleProxyResponse,
} from '../../shared/route-helpers';

const API_BASE_URL = getServiceBaseUrl('user');

export async function GET(request: Request) {
  if (!API_BASE_URL) {
    return createServerErrorResponse();
  }

  const authorization = request.headers.get('Authorization');

  if (!authorization) {
    return createUnauthorizedResponse();
  }

  try {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authorization,
      },
      cache: 'no-store',
    });
    return handleProxyResponse(response);
  } catch (error) {
    console.error('[GET /api/users/me]', error);
    return createServerErrorResponse('시스템 오류가 발생했습니다.');
  }
}
