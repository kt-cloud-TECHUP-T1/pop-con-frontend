// NOTE 대충 틀만 잡아둔 것

import {
  createServerErrorResponse,
  createUnauthorizedResponse,
  getServiceBaseUrl,
  handleProxyResponse,
} from '../shared/route-helpers';

const API_BASE_URL = getServiceBaseUrl('queue');

export async function DELETE(request: Request) {
  if (!API_BASE_URL) {
    return createServerErrorResponse();
  }

  const queueToken = request.headers.get('X-Queue-Token');
  const authorization = request.headers.get('Authorization');

  if (!queueToken || !authorization) {
    return createUnauthorizedResponse();
  }

  try {
    const response = await fetch(`${API_BASE_URL}/queue`, {
      method: 'DELETE',
      headers: {
        'X-Queue-Token': queueToken,
        Authorization: authorization,
      },
    });

    if (response.status === 204) {
      return new Response(null, { status: 204 });
    }

    return handleProxyResponse(response);
  } catch (error) {
    console.error('[DELETE /api/queue]', error);
    return createServerErrorResponse();
  }
}
