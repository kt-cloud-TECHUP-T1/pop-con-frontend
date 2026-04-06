import {
  createBadRequestResponse,
  createServerErrorResponse,
  handleProxyResponse,
} from '../../shared/route-helpers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, '');
const MIN_LIMIT = 1;
const MAX_LIMIT = 3;

export async function GET(request: Request) {
  if (!API_BASE_URL) {
    return createServerErrorResponse();
  }

  const { searchParams } = new URL(request.url);

  const rawLimit = searchParams.get('limit') ?? String(MAX_LIMIT);
  const limit = Number(rawLimit);

  if (!Number.isInteger(limit) || limit < MIN_LIMIT || limit > MAX_LIMIT) {
    return createBadRequestResponse({
      limit: `limit는 ${MIN_LIMIT} 이상 ${MAX_LIMIT} 이하여야 합니다.`,
    });
  }

  searchParams.set('limit', String(limit));

  try {
    const response = await fetch(`${API_BASE_URL}/magazines?${searchParams}`, {
      cache: 'no-store',
    });
    return handleProxyResponse(response);
  } catch (error) {
    console.error('[GET /api/popups/magazines]', error);
    return createServerErrorResponse('서버 내부 오류가 발생했습니다.');
  }
}
