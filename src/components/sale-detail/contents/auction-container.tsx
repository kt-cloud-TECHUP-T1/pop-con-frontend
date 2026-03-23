'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getPopupDetail } from '@/app/api/sale-detail/get-popup-detail';
import { Wrapper } from '@/components/layout/wrapper';
import { SaleDetailLayout } from '@/components/layout/sale-detail-layout';
import { SaleDetailMain } from '@/components/sale-detail/contents/sale-detail-main';
import SaleTimeCountBar from '@/components/sale-detail/contents/sale-time-count-bar';
import { SaleDetailSidebar } from '@/components/sale-detail/info/sale-detail-sidebar';
import { RecommendedPopup } from '@/components/sale-detail/popup/recommended-popup';
import { RelatedPopup } from '@/components/sale-detail/popup/related-popup';
import { getAuctionDetail } from '@/app/api/sale-detail/get-auction-detail';
import { connectAuctionStream } from '@/app/api/sale-detail/connect-auction-stream';
import { AuctionData, AuctionSidebarProps } from '@/types/sale-detail';

type PopupDetailData = Awaited<ReturnType<typeof getPopupDetail>>;

export function AuctionContainer() {
  const params = useParams<{ popupId: string }>();
  const popupId = params.popupId;
  const popupIdNumber = Number(popupId);

  const [saleMainData, setSaleMainData] = useState<PopupDetailData | null>(
    null
  );
  const [initialAuctionData, setInitialAuctionData] =
    useState<AuctionData | null>(null);
  const [liveAuctionData, setLiveAuctionData] = useState<AuctionData | null>(
    null
  );

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log(initialAuctionData, 'initialAuctionData');
  console.log(liveAuctionData, 'liveAuctionData');
  console.log(saleMainData, 'saleMainData');

  useEffect(() => {
    if (!popupId || Number.isNaN(popupIdNumber)) {
      setError('유효하지 않은 popupId입니다.');
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    let disconnectStream: (() => void) | undefined;

    const fetchData = async () => {
      try {
        const [popupDetail, auctionDetail] = await Promise.all([
          getPopupDetail(popupIdNumber),
          getAuctionDetail(popupIdNumber),
        ]);

        if (!isMounted) return;

        setSaleMainData(popupDetail);
        setInitialAuctionData(auctionDetail);

        disconnectStream = connectAuctionStream({
          auctionId: popupIdNumber,
          onAuctionPrice: (data) => {
            if (!isMounted) return;
            setLiveAuctionData(data);
          },
          onError: () => {
            console.error('경매 SSE 연결 중 오류가 발생했습니다.');
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
    };
  }, [popupId, popupIdNumber]);

  if (isLoading) {
    return <div>로딩중...</div>;
  }

  if (error || !saleMainData || !popupId || !initialAuctionData) {
    return <div>{error ?? '데이터를 불러오지 못했습니다.'}</div>;
  }

  const auctionData = liveAuctionData ?? initialAuctionData;
  const hasStickyTopBar = saleMainData.phaseStatus !== 'UPCOMING';

  const leftMainProps = {
    description: saleMainData.description,
    image: saleMainData.thumbnailUrl,
    location: saleMainData.location,
    reviewCount: saleMainData.reviewCount,
    title: saleMainData.title,
    subtitle: saleMainData.subtitle,
    viewCount: saleMainData.viewCount,
    likeCount: saleMainData.likeCount,
  };

  const rightSubProps: AuctionSidebarProps = {
    ...auctionData,
    phaseType: 'AUCTION',
    phaseStatus: saleMainData.phaseStatus,
    openAt: saleMainData.openAt,
    closeAt: saleMainData.closeAt,
    weekdayOpen: saleMainData.weekdayOpen,
    weekdayClose: saleMainData.weekdayClose,
    weekendOpen: saleMainData.weekendOpen,
    weekendClose: saleMainData.weekendClose,
    location: saleMainData.location,
    popupId: saleMainData.popupId,
  };

  return (
    <div>
      {saleMainData.phaseType === 'AUCTION' && (
        <SaleTimeCountBar
          phaseStatus={auctionData.auctionStatus}
          auctionCloseAt={auctionData.auctionCloseAt}
          serverTime={auctionData.serverTime}
        />
      )}

      <Wrapper className="pt-m pb-3xl">
        <SaleDetailLayout
          hasStickyTopBar={hasStickyTopBar}
          left={<SaleDetailMain {...leftMainProps} />}
          right={<SaleDetailSidebar {...rightSubProps} />}
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
