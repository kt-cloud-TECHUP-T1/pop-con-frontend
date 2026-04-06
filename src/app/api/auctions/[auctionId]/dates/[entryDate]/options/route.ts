import {
  createUnauthorizedResponse,
  createServerErrorResponse,
  getServiceBaseUrl,
  handleProxyResponse,
} from '@/app/api/shared/route-helpers';

const API_BASE_URL = getServiceBaseUrl('auction');

export async function GET(
  request: Request,
  { params }: { params: Promise<{ auctionId: string; entryDate: string }> }
) {
  if (!API_BASE_URL) {
    return createServerErrorResponse();
  }

  const authorization = request.headers.get('Authorization');
  const { auctionId, entryDate } = await params;

  if (!authorization) {
    return createUnauthorizedResponse();
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/auctions/${auctionId}/dates/${entryDate}/options`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authorization,
        },
      }
    );

    return handleProxyResponse(response);
  } catch (error) {
    console.error(
      '[GET /api/auctions/[auctionId]/dates/[entryDate]/options]',
      error
    );
    return createServerErrorResponse();
  }
}
