import {
  createUnauthorizedResponse,
  createServerErrorResponse,
  getServiceBaseUrl,
  handleProxyResponse,
} from '@/app/api/shared/route-helpers';

const API_BASE_URL = getServiceBaseUrl('draw');

export async function GET(
  request: Request,
  { params }: { params: Promise<{ drawId: string }> }
) {
  if (!API_BASE_URL) {
    return createServerErrorResponse();
  }

  const authorization = request.headers.get('Authorization');
  const { drawId } = await params;

  if (!authorization) {
    return createUnauthorizedResponse();
  }

  try {
    const response = await fetch(`${API_BASE_URL}/draws/${drawId}/dates`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authorization,
      },
    });

    return handleProxyResponse(response);
  } catch (error) {
    console.error('[GET /api/draws/[drawId]/dates]', error);
    return createServerErrorResponse();
  }
}
