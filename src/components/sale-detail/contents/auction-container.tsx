'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getPopupDetail } from '@/app/api/sale-detail/get-popup-detail';
import { Wrapper } from '@/components/layout/wrapper';
import { SaleDetailLayout } from '@/components/layout/sale-detail-layout';
import { SaleDetailMain } from '@/components/sale-detail/contents/sale-detail-main';
import SaleTimeCountBar from '@/components/sale-detail/contents/sale-time-count-bar';
import { SaleAuctionSidebar } from '@/components/sale-detail/info/sale-auction-sidebar';
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
        const popupDetail = await getPopupDetail(popupIdNumber);

        if (!isMounted) return;

        setSaleMainData(popupDetail);

        const auctionId = popupDetail.auctionId;

        if (!auctionId) {
          throw new Error('경매 ID가 없습니다.');
        }

        const auctionDetail = await getAuctionDetail(auctionId);

        if (!isMounted) return;

        setInitialAuctionData(auctionDetail);

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
    };
  }, [popupIdNumber, popupId]);

  if (isLoading) {
    return <div>로딩중...</div>;
  }

  if (error || !saleMainData || !popupId || !initialAuctionData) {
    return <div>{error ?? '데이터를 불러오지 못했습니다.'}</div>;
  }

  const auctionData = liveAuctionData ?? initialAuctionData;
  const hasStickyTopBar =
    saleMainData.phaseStatus !== 'UPCOMING' &&
    saleMainData.phaseType == 'AUCTION';

  const leftMainProps = {
    description: saleMainData.description,
    image: saleMainData.thumbnailUrl,
    location: saleMainData.location,
    reviewCount: saleMainData.reviewCount,
    title: saleMainData.title,
    subtitle: saleMainData.subtitle,
    viewCount: saleMainData.viewCount,
    likeCount: saleMainData.likeCount,
    hasStickyTopBar,
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
    connetedDrawId: saleMainData.drawId,
  };

  return (
    <div>
      <SaleTimeCountBar
        phaseStatus={auctionData.auctionStatus}
        auctionCloseAt={auctionData.auctionCloseAt}
        serverTime={auctionData.serverTime}
      />
      <Wrapper className="pt-m pb-3xl">
        <SaleDetailLayout
          hasStickyTopBar={hasStickyTopBar}
          left={<SaleDetailMain {...leftMainProps} />}
          right={<SaleAuctionSidebar {...rightSubProps} />}
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
