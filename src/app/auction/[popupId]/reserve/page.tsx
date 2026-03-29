'use client';
import SaleTimeCountBar from '@/components/sale-detail/contents/sale-time-count-bar';
import { Wrapper } from '@/components/layout/wrapper';
import { AuctionReservePageClient } from './components/auction-reserve-page-client';
import { mockReserveData } from './mock-reserve-data';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AuctionData } from '@/types/sale-detail';
import { getAuctionDetail } from '@/app/api/sale-detail/get-auction-detail';
import { connectAuctionStream } from '@/app/api/sale-detail/connect-auction-stream';

export default function AuctionReservePage() {
  const params = useParams<{ popupId: string }>();
  const auctionId = Number(params.popupId);

  const [initialAuctionData, setInitialAuctionData] =
    useState<AuctionData | null>(null);
  const [liveAuctionData, setLiveAuctionData] = useState<AuctionData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!auctionId) {
      setError('유효하지 않은 auctionId입니다.');
      setIsLoading(false);
      return;
    }
    let isMounted = true;
    let disconnectStream: (() => void) | undefined;

    const fetchData = async () => {
      try {
        const auctionDetail = await getAuctionDetail(auctionId);

        if (!isMounted) return;

        setInitialAuctionData(auctionDetail);

        disconnectStream = connectAuctionStream({
          auctionId,
          onAuctionPrice: (data) => {
            if (!isMounted) return;
            setLiveAuctionData(data);
          },
          onError: () => {
            throw new Error('SSE 연결 중 오류가 발생했습니다.');
          },
        });
      } catch (err) {
        if (!isMounted) return;

        setError(
          err instanceof Error
            ? err.message
            : '상세 조회 중 오류가 발생했습니다.'
        );
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      disconnectStream?.();
    };
  }, [, auctionId]);

  if (isLoading) {
    return <div>로딩중...</div>;
  }

  if (error || !initialAuctionData) {
    return <div>{error ?? '데이터를 불러오지 못했습니다.'}</div>;
  }

  const auctionData: AuctionData = liveAuctionData ?? initialAuctionData;

  return (
    <>
      {/* 상단 남은 시간 바 */}
      <SaleTimeCountBar
        auctionStatus={auctionData.auctionStatus}
        auctionCloseAt={auctionData.auctionCloseAt}
        serverTime={auctionData.serverTime}
      />

      {/* 날짜/회차 선택 상태는 아래 컴포넌트에서 관리 */}
      <Wrapper className="pt-8 pb-3xl">
        <AuctionReservePageClient {...auctionData} />
      </Wrapper>
    </>
  );
}
