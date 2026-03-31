'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getPopupDetail } from '@/app/api/sale-detail/get-popup-detail';
import { Wrapper } from '@/components/layout/wrapper';
import { SaleDetailLayout } from '@/components/layout/sale-detail-layout';
import { SaleDetailMain } from '@/components/sale-detail/contents/sale-detail-main';
import SaleTimeCountBar from '@/components/sale-detail/contents/sale-time-count-bar';
import { SaleAuctionDetailSidebar } from '@/components/sale-detail/info/sale-auction-detail-sidebar';
import { RecommendedPopup } from '@/components/sale-detail/popup/recommended-popup';
import { RelatedPopup } from '@/components/sale-detail/popup/related-popup';
import { getAuctionDetail } from '@/app/api/sale-detail/get-auction-detail';
import { connectAuctionStream } from '@/app/api/sale-detail/connect-auction-stream';
import { AuctionData } from '@/types/sale-detail';
import { usePopupStore } from '../stores/popup-store';
import { useAuctionLatestData, useAuctionStore } from '../stores/auction-store';

//Auction Data 복구
export function AuctionContainer() {
  const params = useParams<{ popupId: string }>();
  const popupId = params.popupId;
  const popupIdNumber = Number(popupId);

  const { setPopupData, resetPopupData } = usePopupStore();
  const { setInitialAuctionData, setLiveAuctionData, resetAuctionData } =
    useAuctionStore();
  const auctionStatus = useAuctionStore(
    (state) => state.initialData?.auctionStatus
  );
  const popupData = usePopupStore((state) => state.data);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    //기존 스토어 데이터 삭제
    resetAuctionData();
    resetPopupData();

    if (!popupId || Number.isNaN(popupIdNumber)) {
      setError('유효하지 않은 popupId입니다.');
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    let disconnectStream: (() => void) | undefined;

    const fetchData = async () => {
      try {
        const popupDetail = await getPopupDetail(popupIdNumber);

        if (!isMounted) return;

        setPopupData(popupDetail); //main Popup 데이터 저장

        const auctionId = popupDetail.auctionId;

        if (!auctionId) {
          throw new Error('경매 ID가 없습니다.');
        }

        const auctionDetail: AuctionData = await getAuctionDetail(auctionId);

        if (!isMounted) return;
        setInitialAuctionData(auctionDetail); //auction 초기 데이터 저장

        disconnectStream = connectAuctionStream({
          auctionId,
          onAuctionPrice: (data) => {
            if (!isMounted) return;
            setLiveAuctionData(data);
          },
          onError: () => {
            throw new Error('SSE 연결 중 오류가 발생했습니다.');
          },
        });
      } catch (err) {
        if (!isMounted) return;

        setError(
          err instanceof Error
            ? err.message
            : '상세 조회 중 오류가 발생했습니다.'
        );
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      disconnectStream?.();
      resetAuctionData();
      resetPopupData();
    };
  }, [popupIdNumber, popupId]);

  if (isLoading) {
    return <div>로딩중...</div>;
  }

  if (error || !popupData || !popupId || !auctionStatus) {
    return <div>{error ?? '데이터를 불러오지 못했습니다.'}</div>;
  }

  const hasStickyTopBar = auctionStatus !== 'SCHEDULED';

  return (
    <div>
      <SaleTimeCountBar />
      <Wrapper className="pt-m pb-3xl">
        <SaleDetailLayout
          hasStickyTopBar={hasStickyTopBar}
          left={<SaleDetailMain hasStickyTopBar={hasStickyTopBar} />}
          right={<SaleAuctionDetailSidebar />}
          bottom={
            <>
              <RelatedPopup />
              <RecommendedPopup />
            </>
          }
        />
      </Wrapper>
    </div>
  );
}
