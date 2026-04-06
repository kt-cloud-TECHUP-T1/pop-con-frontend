import {
  createServerErrorResponse,
  createUnauthorizedResponse,
  getServiceBaseUrl,
  handleProxyResponse,
} from '@/app/api/shared/route-helpers';

const API_BASE_URL = getServiceBaseUrl('queue');

export async function POST(
  request: Request,
  { params }: { params: Promise<{ drawId: string }> }
) {
  if (!API_BASE_URL) {
    return createServerErrorResponse();
  }

  const { drawId } = await params;

  const authorization = request.headers.get('Authorization');

  if (!authorization) {
    return createUnauthorizedResponse();
  }

  try {
    const response = await fetch(`${API_BASE_URL}/queues/draws/${drawId}`, {
      method: 'POST',
      headers: {
        Authorization: authorization,
      },
    });

    return handleProxyResponse(response);
  } catch (error) {
    console.error('[POST /api/queue/draws/[drawId]]', error);
    return createServerErrorResponse();
  }
}
