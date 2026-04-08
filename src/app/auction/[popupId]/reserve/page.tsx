'use client';
import SaleTimeCountBar from '@/components/sale-detail/contents/sale-time-count-bar';
import { Wrapper } from '@/components/layout/wrapper';
import { AuctionReservePageClient } from './components/auction-reserve-page-client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuctionStore } from '@/components/sale-detail/stores/auction-store';
import { connectAuctionStream } from '@/app/api/sale-detail/connect-auction-stream';
import { ApiError } from '@/lib/api-error';

export default function AuctionReservePage() {
  const params = useParams<{ popupId: string }>();
  //넘겨준쪽에서는 auctionId 를 넘김
  const auctionId = Number(params.popupId);
  const resetAuctionData = useAuctionStore((state) => state.resetAuctionData);
  const setLiveAuctionData = useAuctionStore(
    (state) => state.setLiveAuctionData
  );
  const [sseError, setSseError] = useState<ApiError | null>(null);

  //새로고침 시 store 값 날아가는거 대비 복구fetch 용 id
  useEffect(() => {
    resetAuctionData();

    if (!auctionId || Number.isNaN(auctionId)) return;

    let isMounted = true;

    const disconnectStream = connectAuctionStream({
      auctionId: auctionId,
      onAuctionPrice: (data) => {
        if (!isMounted) return;
        setLiveAuctionData(data);
        setSseError(null);
      },
      onError: () => {
        if (!isMounted) return;
        setSseError(
          new ApiError({
            code: 'NETWORK_ERROR',
            message: '실시간 경매 데이터 연결에 실패했습니다.',
          })
        );
      },
    });

    return () => {
      isMounted = false;
      disconnectStream?.();
      resetAuctionData();
    };
  }, [auctionId, resetAuctionData, setLiveAuctionData]);

  return (
    <>
      {/* 상단 남은 시간 바 */}
      <SaleTimeCountBar />

      {/* 날짜/회차 선택 상태는 아래 컴포넌트에서 관리 */}
      <Wrapper className="pt-8 pb-3xl">
        <AuctionReservePageClient auctionId={auctionId} />
      </Wrapper>
    </>
  );
}
