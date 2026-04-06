import SaleTimeCountBar from '@/components/sale-detail/contents/sale-time-count-bar';
import { Wrapper } from '@/components/layout/wrapper';
import { AuctionReservePageClient } from './components/auction-reserve-page-client';
import { mockReserveData } from './mock-reserve-data';

export default async function AuctionReservePage({
  params,
}: {
  params: Promise<{ popupId: string }>;
}) {
  const { popupId } = await params;

  return (
    <>
      {/* 상단 남은 시간 바 재활용 */}
      <SaleTimeCountBar
        phaseStatus={mockReserveData.phaseStatus}
        auctionCloseAt={mockReserveData.auctionCloseAt}
        serverTime={mockReserveData.serverTime}
      />

      {/* 날짜/회차 선택 상태는 아래 컴포넌트에서 관리 */}
      <Wrapper className="pt-8 pb-3xl">
        <AuctionReservePageClient auctionId={popupId} />
      </Wrapper>
    </>
  );
}
