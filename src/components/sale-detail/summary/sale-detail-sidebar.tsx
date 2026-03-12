// auction-detail-sidebar.tsx
import PaymentRegisterCard from '@/components/sale-detail/summary/payment-register-card';
import { AuctionInfoContent } from '@/constants/sale-detail';
import OpenCountCard from './open-count-card';
import SaleNoticeCard from '@/components/sale-detail/summary/sale-notice-card';
import SaleInfoCard from './sale-info-card';

export interface SaleDetailSidebarProps {
  openAt: string;
  closeAt: string;

  weekdayOpen: string;
  weekdayClose: string;

  weekendOpen: string;
  weekendClose: string;

  auctionOpenAt: string;
  auctionCloseAt: string;

  drawOpenAt: string;
  drawCloseAt: string;

  startPrice: number;
  currentPrice: number;

  extraTicket: number;

  phaseType: string;
  phaseStatus: string;
  serverTime: string;
  location: string;
}

export function SaleDetailSidebar({
  location,
  openAt,
  closeAt,
  weekdayOpen,
  weekdayClose,
  weekendOpen,
  weekendClose,
  auctionOpenAt,
  auctionCloseAt,
  startPrice,
  currentPrice,
  extraTicket,
  phaseType,
  phaseStatus,
  serverTime,
}: SaleDetailSidebarProps) {
  return (
    <div className="flex flex-col gap-s">
      <OpenCountCard
        saleOpenAt={auctionOpenAt}
        phaseType={phaseType}
        phaseStatus={phaseStatus}
        serverTime={serverTime}
      ></OpenCountCard>
      <PaymentRegisterCard title="경매" />
      <SaleInfoCard
        phaseType={phaseType}
        phaseStatus={phaseStatus}
        openAt={openAt}
        closeAt={closeAt}
        weekdayOpen={weekdayOpen}
        weekdayClose={weekdayClose}
        weekendOpen={weekendOpen}
        weekendClose={weekendClose}
        location={location}
        priceCloseAt={auctionCloseAt}
        startPrice={startPrice}
        currentPrice={currentPrice}
        extraTicket={extraTicket}
        serverTime={serverTime}
      ></SaleInfoCard>

      <SaleNoticeCard items={AuctionInfoContent} />
    </div>
  );
}
