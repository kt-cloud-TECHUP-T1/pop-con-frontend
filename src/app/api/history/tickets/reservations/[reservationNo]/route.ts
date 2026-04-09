import {
  createUnauthorizedResponse,
  createServerErrorResponse,
  handleProxyResponse,
  getServiceBaseUrl,
} from '@/app/api/shared/route-helpers';

const API_BASE_URL = getServiceBaseUrl('user');

export async function GET(
  request: Request,
  { params }: { params: Promise<{ reservationNo: string }> }
) {
  const authorization = request.headers.get('Authorization');

  if (!authorization) {
    return createUnauthorizedResponse();
  }

  const { reservationNo } = await params;

  try {
    const response = await fetch(
      `${API_BASE_URL}/history/tickets/reservations/${reservationNo}`,
      {
        method: 'GET',
        headers: {
          Authorization: authorization,
        },
      }
    );

    return handleProxyResponse(response);
  } catch (error) {
    console.error('[GET /api/history/tickets/reservations/:reservationNo]', error);
    return createServerErrorResponse();
  }
}
