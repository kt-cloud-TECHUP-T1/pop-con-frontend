import { AuctionData } from '@/types/popup/sale-detail';

interface ConnectAuctionStreamParams {
  auctionId: number;
  onAuctionPrice: (data: AuctionData) => void;
  onError?: (error: Event) => void;
}

export function connectAuctionStream({
  auctionId,
  onAuctionPrice,
  onError,
}: ConnectAuctionStreamParams) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '');

  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_API_BASE_URL이 설정되지 않았습니다.');
  }

  const url = `${baseUrl}/auctions/${auctionId}/stream`;

  const eventSource = new EventSource(url);

  eventSource.addEventListener('auction-price', (event) => {
    const messageEvent = event as MessageEvent<string>;
    const data = JSON.parse(messageEvent.data) as AuctionData;
    onAuctionPrice(data);
  });

  // ping는 화면 갱신에 필요 없어서 무시
  eventSource.addEventListener('ping' as never, () => {});

  eventSource.onerror = (error) => {
    onError?.(error);
  };

  return () => {
    eventSource.close();
  };
}
