// NOTE 대충 틀만 잡아둔 것

import {
  createServerErrorResponse,
  createUnauthorizedResponse,
  handleProxyResponse,
} from '@/app/api/shared/route-helpers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, '');

export async function POST(
  request: Request,
  { params }: { params: Promise<{ auctionId: string }> }
) {
  if (!API_BASE_URL) {
    return createServerErrorResponse();
  }

  const { auctionId } = await params;

  const authorization = request.headers.get('Authorization');

  if (!authorization) {
    return createUnauthorizedResponse();
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/auctions/${auctionId}/queue-entries`,
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
    console.error('[POST /api/auctions/[auctionId]/queue-entries]', error);
    return createServerErrorResponse();
  }
}
