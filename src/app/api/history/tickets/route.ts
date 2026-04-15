import {
  createUnauthorizedResponse,
  createServerErrorResponse,
  handleProxyResponse,
  getServiceBaseUrl,
} from '@/app/api/shared/route-helpers';

const API_BASE_URL = getServiceBaseUrl('user');

export async function GET(request: Request) {
  if (!API_BASE_URL) {
    return createServerErrorResponse();
  }

  const authorization = request.headers.get('Authorization');

  if (!authorization) {
    return createUnauthorizedResponse();
  }

  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') ?? '0';
  const size = searchParams.get('size') ?? '20';

  try {
    const response = await fetch(
      `${API_BASE_URL}/history/tickets?page=${page}&size=${size}`,
      {
        method: 'GET',
        headers: {
          Authorization: authorization,
        },
      }
    );

    return handleProxyResponse(response);
  } catch (error) {
    console.error('[GET /api/history/tickets]', error);
    return createServerErrorResponse();
  }
}
