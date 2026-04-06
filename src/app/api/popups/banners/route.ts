import {
  createBadRequestResponse,
  createServerErrorResponse,
  handleProxyResponse,
} from '@/app/api/shared/route-helpers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, '');

const DEFAULT_LIMIT = 5;
const MIN_LIMIT = 1;
const MAX_LIMIT = 5;

export async function GET(request: Request) {
  if (!API_BASE_URL) {
    return createServerErrorResponse();
  }

  const { searchParams } = new URL(request.url);

  const rawLimit = searchParams.get('limit') ?? String(DEFAULT_LIMIT);
  const limit = Number(rawLimit);

  if (!Number.isInteger(limit) || limit < MIN_LIMIT || limit > MAX_LIMIT) {
    return createBadRequestResponse({
      limit: `limit는 ${MIN_LIMIT} 이상 ${MAX_LIMIT} 이하여야 합니다.`,
    });
  }

  searchParams.set('limit', String(limit));

  try {
    const response = await fetch(
      `${API_BASE_URL}/popups/banners?${searchParams}`,
      { cache: 'no-store' }
    );

    return handleProxyResponse(response);
  } catch (error) {
    console.error('[GET /api/popups/banners]', error);
    return createServerErrorResponse('시스템 오류가 발생했습니다.');
  }
}
