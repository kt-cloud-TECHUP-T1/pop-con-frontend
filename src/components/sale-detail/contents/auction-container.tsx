'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import { getPopupDetail } from '@/lib/api/popup/get-popup-detail';
import { Wrapper } from '@/components/layout/wrapper';
import { SaleDetailLayout } from '@/components/layout/sale-detail-layout';
import { SaleDetailMain } from '@/components/sale-detail/contents/sale-detail-main';
import SaleTimeCountBar from '@/components/sale-detail/contents/sale-time-count-bar';
import { SaleAuctionDetailSidebar } from '@/components/sale-detail/info/sale-auction-detail-sidebar';
import { RecommendedPopup } from '@/components/sale-detail/popup/recommended-popup';
import { RelatedPopup } from '@/components/sale-detail/popup/related-popup';
import { connectAuctionStream } from '@/app/api/sale-detail/connect-auction-stream';
import { useAuctionStore } from '../stores/auction-store';
import { ApiError } from '@/lib/api-error';
import { SaleDetailSkeleton } from '../ui/loading/sale-detail-skeleton';
import { ErrorPage } from '../ui/error/error-page';

import { snackbar } from '@/components/ui/snackbar';

export function AuctionContainer() {
  const params = useParams<{ popupId: string }>();
  const popupId = params.popupId;
  const popupIdNumber = Number(popupId);

  const { setLiveAuctionData, resetAuctionData } = useAuctionStore();
  const liveAuctionData = useAuctionStore((state) => state.liveData);
  const router = useRouter();
  const [sseError, setSseError] = useState<ApiError | null>(null);

  const {
    data: popupData,
    isPending: isPopupPending,
    isError: isPopupError,
    error: popupError,
  } = useQuery({
    queryKey: ['popup-detail', popupIdNumber],
    queryFn: () => getPopupDetail(popupIdNumber),
    enabled: Boolean(popupId) && !Number.isNaN(popupIdNumber),
  });

  useEffect(() => {
    resetAuctionData();

    if (!popupData?.auctionId) return;

    let isMounted = true;

    const disconnectStream = connectAuctionStream({
      auctionId: popupData.auctionId,
      onAuctionPrice: (data) => {
        if (!isMounted) return;
        setLiveAuctionData(data);
        setSseError(null);
      },
      onError: () => {
        if (!isMounted) return;
        setSseError(
          new ApiError({
            code: 'NETWORK_ERROR',
            message: '실시간 경매 데이터 연결에 실패했습니다.',
          })
        );
      },
    });

    return () => {
      isMounted = false;
      disconnectStream?.();
      resetAuctionData();
    };
  }, [popupData?.auctionId, resetAuctionData, setLiveAuctionData]);

  useEffect(() => {
    if (liveAuctionData?.auctionStatus !== 'CLOSED') return;

    snackbar.success({
      title: `경매 종료`,
      description: `잠시 후 드로우페이지로 이동됩니다.`,
    });

    const timerId = setTimeout(() => {
      router.push(`/draw/${popupId}`);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [liveAuctionData?.auctionStatus, router, popupId]);

  if (!popupId || Number.isNaN(popupIdNumber)) {
    return <ErrorPage code="C001" message="유효하지 않은 popupId입니다." />;
  }

  if (isPopupPending) {
    return <SaleDetailSkeleton />;
  }

  if (isPopupError) {
    if (popupError instanceof ApiError) {
      return <ErrorPage code={popupError.code} message={popupError.message} />;
    }

    return <ErrorPage code="NETWORK_ERROR" />;
  }

  if (!popupData) {
    return (
      <ErrorPage code="UNKNOWN_ERROR" message="데이터를 불러오지 못했습니다." />
    );
  }
  if (sseError) {
    return <ErrorPage code={sseError.code} message={sseError.message} />;
  }
  if (!liveAuctionData) {
    return <SaleDetailSkeleton />;
  }

  const hasStickyTopBar = liveAuctionData.auctionStatus !== 'SCHEDULED';

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
