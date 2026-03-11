// auction-detail-sidebar.tsx
import NoticeCard from '@/components/sale-detail/summary/notice-card';
import PaymentRegisterCard from '@/components/sale-detail/summary/payment-register-card';
import { AuctionInfoContent } from '@/constants/sale-detail';

export interface SaleDetailSidebarProps {
  openAt: string;
  closeAt: string;

  weekdayOpen: string;
  weekdayClose: string;

  weekendOpen: string;
  weekendClose: string;

  auctionOpenAt?: string;
  auctionCloseAt?: string;

  drawOpenAt?: string;
  drawCloseAt?: string;

  startPrice: number;
  currentPrice: number;

  extraTicket: number;

  phaseType: string;
  phaseStatus: string;
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
}: SaleDetailSidebarProps) {
  return (
    <div className="flex flex-col gap-s">
      <NoticeCard items={AuctionInfoContent} />
      <PaymentRegisterCard title="경매" />
    </div>
  );
}
