// auction-detail-sidebar.tsx
import PaymentRegisterCard from '@/components/sale-detail/info/payment-register-card';
import { AuctionInfoContent, DrawInfoContent } from '@/constants/sale-detail';
import OpenCountCard from './open-count-card';
import SaleNoticeCard from '@/components/sale-detail/info/sale-notice-card';
import SaleInfoCard from './sale-info-card';
import { SaleDetailSidebarProps } from '@/types/sale-detail';

export function SaleDetailSidebar(props: SaleDetailSidebarProps) {
  return (
    <div className="flex flex-col gap-s">
      <OpenCountCard
        serverTime={props.serverTime}
        phaseType="AUCTION"
        phaseStatus={props.phaseStatus}
        saleOpenAt={props.openAt}
      ></OpenCountCard>
      <SaleInfoCard {...props}></SaleInfoCard>
      <SaleNoticeCard items={DrawInfoContent} />
    </div>
  );
}
