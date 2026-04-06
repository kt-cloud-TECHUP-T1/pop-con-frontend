import type {
  AuctionData,
  AuctionDetailResponse,
  AuctionErrorResponse,
} from '@/types/sale-detail';

export async function getAuctionDetail(
  auctionId: number
): Promise<AuctionData> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '');

  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_API_BASE_URL이 설정되지 않았습니다.');
  }

  const url = `${baseUrl}/auctions/${auctionId}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    let errorData: AuctionErrorResponse | null = null;

    try {
      errorData = await response.json();
    } catch {
      throw new Error(`경매 상세 조회 실패 : ${response.status}`);
    }

    throw new Error(
      errorData?.message ?? `경매 상세 조회 실패 : ${response.status}`
    );
  }

  const result: AuctionDetailResponse = await response.json();

  return result.data;
}
