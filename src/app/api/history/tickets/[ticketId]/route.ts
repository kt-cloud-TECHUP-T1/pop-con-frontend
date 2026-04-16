import {
  createUnauthorizedResponse,
  createServerErrorResponse,
  handleProxyResponse,
  getServiceBaseUrl,
} from '@/app/api/shared/route-helpers';

const API_BASE_URL = getServiceBaseUrl('user');

export async function GET(
  request: Request,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  if (!API_BASE_URL) {
    return createServerErrorResponse();
  }

  const authorization = request.headers.get('Authorization');

  if (!authorization) {
    return createUnauthorizedResponse();
  }

  const { ticketId } = await params;

  try {
    const response = await fetch(
      `${API_BASE_URL}/history/tickets/${ticketId}`,
      {
        method: 'GET',
        headers: {
          Authorization: authorization,
        },
      }
    );

    return handleProxyResponse(response);
  } catch (error) {
    console.error('[GET /api/history/tickets/:ticketId]', error);
    return createServerErrorResponse();
  }
}
