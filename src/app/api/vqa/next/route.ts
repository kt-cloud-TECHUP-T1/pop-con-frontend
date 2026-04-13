import { handleProxyResponse } from '@/app/api/shared/route-helpers';

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, '') ??
  'http://localhost:8084';

const QUEUE_TOKEN_HEADER = 'X-Queue-Token';

/**
 * GET /api/vqa/next?sessionId=xxx
 * → GET /queues/vqa/next?sessionId=xxx
 * 오답 후 다음 문제 조회
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');

  if (!sessionId) {
    return Response.json(
      { code: 'C001', message: 'sessionId가 필요합니다.', data: null },
      { status: 400 }
    );
  }

  const authorization = request.headers.get('Authorization');
  const queueToken = request.headers.get(QUEUE_TOKEN_HEADER);

  try {
    const response = await fetch(
      `${API_BASE}/queues/vqa/next?sessionId=${encodeURIComponent(sessionId)}`,
      {
        method: 'GET',
        headers: {
          ...(authorization ? { Authorization: authorization } : {}),
          ...(queueToken ? { [QUEUE_TOKEN_HEADER]: queueToken } : {}),
        },
      }
    );

    return handleProxyResponse(response);
  } catch (error) {
    console.error('[proxy] /queues/vqa/next 에러:', error);
    return Response.json(
      { code: 'S001', message: '시스템 오류가 발생했습니다.', data: null },
      { status: 500 }
    );
  }
}
