'use client';
import SaleTimeCountBar from '@/components/sale-detail/contents/sale-time-count-bar';
import { Wrapper } from '@/components/layout/wrapper';
import { AuctionReservePageClient } from './components/auction-reserve-page-client';
import { useParams } from 'next/navigation';

export default function AuctionReservePage() {
  const params = useParams<{ popupId: string }>();
  const auctionId = Number(params.popupId);
  //새로고침 시 store 값 날아가는거 대비 복구fetch 용 id

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
