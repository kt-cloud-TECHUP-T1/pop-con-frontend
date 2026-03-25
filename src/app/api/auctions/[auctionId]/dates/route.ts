import {
  createUnauthorizedResponse,
  createServerErrorResponse,
  handleProxyResponse,
} from '@/app/api/shared/route-helpers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, '');

export async function GET(
  request: Request,
  { params }: { params: Promise<{ auctionId: string }> }
) {
  const authorization = request.headers.get('Authorization');
  const { auctionId } = await params;

  if (!authorization) {
    return createUnauthorizedResponse();
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/auctions/${auctionId}/dates`,
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
    console.error('[auctions/[auctionId]/dates]', error);
    return createServerErrorResponse();
  }
}
