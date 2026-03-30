import { QUEUE_ERROR_CODES, QUEUE_ERROR_MESSAGES } from '@/constants/queue';
import { EnterAuctionQueueResponse } from '@/types/queue/queue';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

function createQueueErrorResponse(
  code: 'C001' | 'A002' | 'A003' | 'Q001' | 'S001'
): EnterAuctionQueueResponse {
  if (code === 'Q001') {
    return {
      code,
      message: QUEUE_ERROR_MESSAGES[code],
      data: {
        status: 'BLOCKED',
        blockedUntil: '',
      },
    };
  }

  return {
    code,
    message: QUEUE_ERROR_MESSAGES[code],
    data: null,
  };
}

export async function enterAuctionQueue(
  auctionId: number,
  accessToken: string
): Promise<EnterAuctionQueueResponse> {
  if (!auctionId || Number.isNaN(auctionId)) {
    return createQueueErrorResponse(QUEUE_ERROR_CODES.INVALID_INPUT);
  }

  if (!accessToken) {
    return createQueueErrorResponse(QUEUE_ERROR_CODES.INVALID_TOKEN);
  }

  try {
    const response = await fetch(
      `${API_BASE_URL.replace(/\/+$/, '')}/queues/auctions/${auctionId}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: 'no-store',
      }
    );

    const result = (await response.json()) as EnterAuctionQueueResponse;

    return result;
  } catch (error) {
    console.error('enterAuctionQueue error:', error);

    return createQueueErrorResponse(QUEUE_ERROR_CODES.SERVER_ERROR);
  }
}
