'use client';

import SaleInfoPrice from './sale-info-price';
import ReservePaymentSection from '@/app/auction/[popupId]/reserve/components/reserve-payment-section';
interface SaleAuctionReserveSidebarProps {
  auctionId: number;
  selectedOptionId: number | null;
}
export default function SaleAuctionReserveSidebar({
  auctionId,
  selectedOptionId,
}: SaleAuctionReserveSidebarProps) {
  return (
    <>
      <SaleInfoPrice></SaleInfoPrice>
      <ReservePaymentSection
        selectedOptionId={selectedOptionId}
      ></ReservePaymentSection>
    </>
  );
}
