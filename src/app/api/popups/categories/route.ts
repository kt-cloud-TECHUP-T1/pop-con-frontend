import { NextResponse } from 'next/server';
import {
  createBadRequestResponse,
  createServerErrorResponse,
  getServiceBaseUrl,
  safeParseResponseBody,
} from '../../shared/route-helpers';

const API_BASE_URL = getServiceBaseUrl('popup');
const MIN_LIMIT = 1;
const MAX_LIMIT = 6;

export async function GET(request: Request) {
  if (!API_BASE_URL) {
    return createServerErrorResponse();
  }

  const authorization = request.headers.get('Authorization');
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
    const response = await fetch(
      `${API_BASE_URL}/popups/categories?${searchParams}`,
      {
        headers: {
          ...(authorization && { Authorization: authorization }),
        },
        cache: 'no-store',
      }
    );

    if (response.status >= 500) {
      return createServerErrorResponse();
    }

    const body = (await safeParseResponseBody(response)) as {
      data?: {
        items?: { isActive?: boolean }[];
        itemCount?: number;
      };
    };

    if (response.ok && Array.isArray(body?.data?.items)) {
      const activeItems = body.data.items.filter(
        (item: { isActive?: boolean }) => item.isActive !== false
      );
      body.data.items = activeItems;
      body.data.itemCount = activeItems.length;
    }

    return NextResponse.json(body, { status: response.status });
  } catch (error) {
    console.error('[GET /api/popups/categories]', error);
    return createServerErrorResponse('시스템 오류가 발생했습니다.');
  }
}
