'use client';

import { useEffect, useState } from 'react';
import { getAuctionDetail } from '@/lib/api/auction/get-auction-detail';
import { connectAuctionStream } from '@/app/api/sale-detail/connect-auction-stream';

import { AuctionData } from '@/types/sale-detail';
import { useAuctionStore } from '../stores/auction-store';
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
  const setInitialAuctionData = useAuctionStore(
    (state) => state.setInitialAuctionData
  );
  const setLiveAuctionData = useAuctionStore(
    (state) => state.setLiveAuctionData
  );
  const resetAuctionData = useAuctionStore((state) => state.resetAuctionData);

  useEffect(() => {
    resetAuctionData();

    if (!auctionId || Number.isNaN(auctionId)) {
      console.log('auctionId가 존재하지않습니다.');
      return;
    }

    let isMounted = true;
    let disconnectStream: (() => void) | undefined;

    const fetchAuctionData = async () => {
      try {
        const auctionDetail: AuctionData = await getAuctionDetail(auctionId);

        if (!isMounted) return;
        setInitialAuctionData(auctionDetail);

        disconnectStream = connectAuctionStream({
          auctionId,
          onAuctionPrice: (data) => {
            if (!isMounted) return;
            setLiveAuctionData(data);
          },
          onError: () => {
            console.error('SSE 연결 중 오류가 발생했습니다.');
          },
        });
      } catch {
        if (!isMounted) return;
      }
    };

    fetchAuctionData();

    return () => {
      isMounted = false;
      disconnectStream?.();
      resetAuctionData();
    };
  }, [auctionId]);

  return (
    <>
      <SaleInfoPrice></SaleInfoPrice>
      <ReservePaymentSection
        selectedOptionId={selectedOptionId}
      ></ReservePaymentSection>
    </>
  );
}
