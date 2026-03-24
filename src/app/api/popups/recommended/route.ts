import {
  createServerErrorResponse,
  handleProxyResponse,
} from '../../shared/route-helpers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, '');

export async function GET(request: Request) {
  if (!API_BASE_URL) {
    return createServerErrorResponse();
  }

  const authorization = request.headers.get('Authorization');

  try {
    const response = await fetch(`${API_BASE_URL}/popups/recommended`, {
      headers: {
        ...(authorization && { Authorization: authorization }),
      },
      cache: 'no-store',
    });
    return handleProxyResponse(response);
  } catch (error) {
    console.error('[GET /api/popups/recommended]', error);
    return createServerErrorResponse('시스템 오류가 발생했습니다.');
  }
}
