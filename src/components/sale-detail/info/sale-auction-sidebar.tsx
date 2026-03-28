// auction-detail-sidebar.tsx
import PaymentRegisterCard from '@/components/sale-detail/info/payment-register-card';
import { AuctionInfoContent } from '@/constants/sale-detail';
import OpenCountCard from './open-count-card';
import SaleNoticeCard from '@/components/sale-detail/info/sale-notice-card';
import SaleInfoCard from './sale-info-card';
import { SaleDetailSidebarProps } from '@/types/sale-detail';

export function SaleAuctionSidebar(props: SaleDetailSidebarProps) {
  return (
    <div className="flex flex-col gap-s">
      <OpenCountCard
        serverTime={props.serverTime}
        phaseStatus={props.phaseStatus}
        saleOpenAt={props.openAt}
      ></OpenCountCard>
      <PaymentRegisterCard></PaymentRegisterCard>
      <SaleInfoCard {...props}></SaleInfoCard>
      <SaleNoticeCard items={AuctionInfoContent} />
    </div>
  );
}
