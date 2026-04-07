// NOTE 대충 틀만 잡아둔 것

import {
  createServerErrorResponse,
  createUnauthorizedResponse,
  getServiceBaseUrl,
  handleProxyResponse,
} from '@/app/api/shared/route-helpers';

const API_BASE_URL = getServiceBaseUrl('draw');

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
    const response = await fetch(
      `${API_BASE_URL}/draws/${drawId}/queue-entries`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authorization,
        },
      }
    );

    return handleProxyResponse(response);
  } catch (error) {
    console.error('[POST /api/draws/[drawId]/queue-entries]', error);
    return createServerErrorResponse();
  }
}
