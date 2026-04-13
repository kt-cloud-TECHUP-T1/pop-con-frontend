import {
  createUnauthorizedResponse,
  handleProxyResponse,
} from '@/app/api/shared/route-helpers';

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, '') ??
  'http://localhost:8084';

const QUEUE_TOKEN_HEADER = 'X-Queue-Token';

function buildForwardHeaders(request: Request): Record<string, string> {
  const authorization = request.headers.get('Authorization');
  const queueToken = request.headers.get(QUEUE_TOKEN_HEADER);

  return {
    'Content-Type': 'application/json',
    ...(authorization ? { Authorization: authorization } : {}),
    ...(queueToken ? { [QUEUE_TOKEN_HEADER]: queueToken } : {}),
  };
}

export async function GET(request: Request) {
  const authorization = request.headers.get('Authorization');

  if (!authorization) {
    return createUnauthorizedResponse();
  }

  const response = await fetch(`${API_BASE}/queues/vqa/start`, {
    method: 'POST',
    headers: buildForwardHeaders(request),
    body: JSON.stringify({ user_agent: '' }),
  });

  return handleProxyResponse(response);
}

export async function POST(request: Request) {
  const body = await request.json();
  const authorization = request.headers.get('Authorization');

  if (!authorization) {
    return createUnauthorizedResponse();
  }

  const response = await fetch(`${API_BASE}/queues/vqa/submit`, {
    method: 'POST',
    headers: buildForwardHeaders(request),
    body: JSON.stringify(body),
  });

  return handleProxyResponse(response);
}
