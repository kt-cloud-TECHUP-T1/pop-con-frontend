'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getPopupDetail } from '@/lib/api/popup/get-popup-detail';
import { Wrapper } from '@/components/layout/wrapper';
import { SaleDetailLayout } from '@/components/layout/sale-detail-layout';
import { SaleDetailMain } from '@/components/sale-detail/contents/sale-detail-main';
import SaleTimeCountBar from '@/components/sale-detail/contents/sale-time-count-bar';
import { SaleAuctionDetailSidebar } from '@/components/sale-detail/info/sale-auction-detail-sidebar';
import { RecommendedPopup } from '@/components/sale-detail/popup/recommended-popup';
import { RelatedPopup } from '@/components/sale-detail/popup/related-popup';
import { getAuctionDetail } from '@/lib/api/auction/get-auction-detail';
import { connectAuctionStream } from '@/app/api/sale-detail/connect-auction-stream';
import { AuctionData } from '@/types/sale-detail';
import { usePopupStore } from '../stores/popup-store';
import { useAuctionStore } from '../stores/auction-store';
import { ApiError } from '@/lib/api-error';

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
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    resetAuctionData();
    resetPopupData();
    setError(null);
    setIsLoading(true);

    if (!popupId || Number.isNaN(popupIdNumber)) {
      setError(
        new ApiError({
          code: 'C001',
          message: '유효하지 않은 popupId입니다.',
          data: { popupId: 'popupId는 숫자여야 합니다.' },
        })
      );
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    let disconnectStream: (() => void) | undefined;

    const fetchData = async () => {
      try {
        const popupDetail = await getPopupDetail(popupIdNumber);

        if (!isMounted) return;
        setPopupData(popupDetail);

        const auctionId = popupDetail.auctionId;

        if (!auctionId) {
          throw new ApiError({
            code: 'UNKNOWN_ERROR',
            message: '경매 ID가 없습니다.',
          });
        }

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
            if (!isMounted) return;

            setError(
              new ApiError({
                code: 'NETWORK_ERROR',
                message: '실시간 경매 데이터 연결에 실패했습니다.',
              })
            );
          },
        });
      } catch (err) {
        if (!isMounted) return;

        if (err instanceof ApiError) {
          setError(err);
          return;
        }

        setError(
          new ApiError({
            code: 'UNKNOWN_ERROR',
            message: '상세 조회 중 알 수 없는 오류가 발생했습니다.',
          })
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
  }, [popupId, popupIdNumber]);

  if (isLoading) {
    return <div>로딩중...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  if (!popupData || !popupId || !auctionStatus) {
    return <div>데이터를 불러오지 못했습니다.</div>;
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
