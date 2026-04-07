import { AUCTION_ERROR_MESSAGES } from '@/constants/auction';
import { COMMON_ERROR_MESSAGES } from '@/constants/error/common';
import { ApiError } from '@/lib/api-error';
import type {
  AuctionData,
  AuctionDetailResponse,
  AuctionErrorResponse,
} from '@/types/sale-detail';

//auction 초기 렌더링용 데이터 패칭 함수
export async function getAuctionDetail(
  auctionId: number
): Promise<AuctionData> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '');

  if (!baseUrl) {
    throw new ApiError({
      code: 'UNKNOWN_ERROR',
      message: 'API 기본 URL이 설정되지 않았습니다.',
    });
  }

  const url = `${baseUrl}/auctions/${auctionId}`;

  let response: Response;

  try {
    response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
  } catch {
    throw new ApiError({
      code: 'NETWORK_ERROR',
      message: COMMON_ERROR_MESSAGES.NETWORK_ERROR,
    });
  }

  let result: AuctionDetailResponse | AuctionErrorResponse;

  try {
    result = (await response.json()) as
      | AuctionDetailResponse
      | AuctionErrorResponse;
  } catch {
    throw new ApiError({
      code: 'INVALID_JSON',
      message: COMMON_ERROR_MESSAGES.INVALID_JSON,
      status: response.status,
    });
  }

  if (result.code !== 'SUCCESS') {
    const errorResult = result as AuctionErrorResponse;

    throw new ApiError({
      code: errorResult.code,
      message:
        AUCTION_ERROR_MESSAGES[
          errorResult.code as keyof typeof AUCTION_ERROR_MESSAGES
        ] ??
        COMMON_ERROR_MESSAGES[
          errorResult.code as keyof typeof COMMON_ERROR_MESSAGES
        ] ??
        errorResult.message ??
        COMMON_ERROR_MESSAGES.UNKNOWN_ERROR,
      status: response.status,
      data: errorResult.data,
    });
  }

  const successResult = result as AuctionDetailResponse;

  return successResult.data;
}
