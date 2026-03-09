// auction-detail-sidebar.tsx
import NoticeCard from '@/components/sale-detail/summary/notice-card';
import PaymentRegisterCard from '@/components/sale-detail/summary/payment-register-card';

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
      <NoticeCard
        items={[
          '경매 및 드로우 신청은 1인 1회로 제한됩니다.',
          '당첨자는 신청 마감 후 24시간 내 개별 연락드립니다.',
          '본인 확인을 위해 신분증을 지참해주세요.',
        ]}
      />
      <PaymentRegisterCard title="경매" />
    </div>
  );
}
