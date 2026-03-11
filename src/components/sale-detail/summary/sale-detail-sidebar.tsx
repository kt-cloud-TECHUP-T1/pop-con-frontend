// auction-detail-sidebar.tsx
import NoticeCard from '@/components/sale-detail/summary/notice-card';
import PaymentRegisterCard from '@/components/sale-detail/summary/payment-register-card';
import { AuctionInfoContent } from '@/constants/sale-detail';
import OpenCountCard from './open-count-card';

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
  serverNow: string;
}

export function SaleDetailSidebar({
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
  serverNow,
}: SaleDetailSidebarProps) {
  return (
    <div className="flex flex-col gap-s">
      <OpenCountCard
        auctionOpenAt={auctionOpenAt}
        phaseType={phaseType}
        phaseStatus={phaseStatus}
        serverNow={serverNow}
      ></OpenCountCard>
      <NoticeCard items={AuctionInfoContent} />
      <PaymentRegisterCard title="경매" />
    </div>
  );
}
