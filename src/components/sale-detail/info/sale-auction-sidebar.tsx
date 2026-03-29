// auction-detail-sidebar.tsx
import PaymentRegisterCard from '@/components/sale-detail/info/payment-register-card';
import { AuctionInfoContent } from '@/constants/sale-detail';
import OpenCountCard from './open-count-card';
import SaleNoticeCard from '@/components/sale-detail/info/sale-notice-card';
import SaleInfoCard from './sale-info-card';
import { SaleDetailSidebarProps } from '@/types/sale-detail';
import { useAuthStore } from '@/features/auth/stores/auth-store';

export function SaleAuctionSidebar() {
  const authStatus = useAuthStore((state) => state.authStatus);

  return (
    <div className="flex flex-col gap-s">
      <OpenCountCard />
      {authStatus === 'unauthenticated' && <PaymentRegisterCard />}
      <SaleInfoCard {...props}></SaleInfoCard>
      <SaleNoticeCard items={AuctionInfoContent} />
    </div>
  );
}
