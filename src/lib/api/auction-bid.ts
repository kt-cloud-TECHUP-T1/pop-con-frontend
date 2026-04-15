import {
  AUCTION_BID_ERROR_MESSAGES,
  AuctionBidErrorCode,
} from '@/constants/sale-bid';
import {
  AuctionBidRequest,
  AuctionBidResult,
} from '@/types/auction/auction-bid';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

export async function postAuctionBid(
  body: AuctionBidRequest,
  accessToken: string,
  quizPassedToken: string
): Promise<AuctionBidResult> {
  try {
    const response = await fetch(
      `${API_BASE_URL.replace(/\/+$/, '')}/auctions/bids`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Quiz-Passed-Token': quizPassedToken,
        },
        body: JSON.stringify(body),
        cache: 'no-store',
      }
    );

    const result = await response.json();

    if (result.code === 'SUCCESS') {
      return {
        code: 'SUCCESS',
        message: result.message,
        data: result.data,
      };
    }

    const errorCode = result.code as AuctionBidErrorCode;

    return {
      code: errorCode,
      message:
        AUCTION_BID_ERROR_MESSAGES[errorCode] ??
        AUCTION_BID_ERROR_MESSAGES.S001,
      data: result.data ?? null,
    };
  } catch {
    return {
      code: 'S001',
      message: AUCTION_BID_ERROR_MESSAGES.S001,
      data: null,
    };
  }
}
