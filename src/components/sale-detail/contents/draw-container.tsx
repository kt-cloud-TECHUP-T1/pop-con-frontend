'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import { SaleDetailLayout } from '@/components/layout/sale-detail-layout';
import { Wrapper } from '@/components/layout/wrapper';
import { RelatedPopup } from '../popup/related-popup';
import { RecommendedPopup } from '../popup/recommended-popup';
import { SaleDetailMain } from './sale-detail-main';
import SaleDrawDetailSidebar from '../info/sale-draw-detail-sidebar';

import { getPopupDetail } from '@/lib/api/popup/get-popup-detail';
import { getDrawDetail } from '@/app/api/sale-detail/get-draw-detail';
import { SaleDetailSkeleton } from '../ui/loading/sale-detail-skeleton';
import { ErrorPage } from '../ui/error/error-page';
import { ApiError } from '@/lib/api-error';

export default function DrawContainer() {
  const params = useParams<{ popupId: string }>();
  const popupId = params.popupId;
  const popupIdNumber = Number(popupId);

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

  const drawId = popupData?.drawId;

  const {
    data: drawData,
    isPending: isDrawPending,
    isError: isDrawError,
    error: drawError,
  } = useQuery({
    queryKey: ['draw-detail', drawId],
    queryFn: () => getDrawDetail(drawId!),
    enabled: !!drawId,
  });

  if (!popupId || Number.isNaN(popupIdNumber)) {
    return <ErrorPage code="C001" message="유효하지 않은 popupId입니다." />;
  }

  if (isPopupPending || (drawId && isDrawPending)) {
    return <SaleDetailSkeleton></SaleDetailSkeleton>;
  }

  if (isPopupError) {
    if (popupError instanceof ApiError) {
      return <ErrorPage code={popupError.code} message={popupError.message} />;
    }

    return <ErrorPage code="NETWORK_ERROR" />;
  }

  if (!popupData || !drawId) {
    return (
      <ErrorPage code="UNKNOWN_ERROR" message="데이터를 불러오지 못했습니다." />
    );
  }

  if (isDrawError) {
    if (drawError instanceof ApiError) {
      return <ErrorPage code={drawError.code} message={drawError.message} />;
    }

    return <ErrorPage code="NETWORK_ERROR" />;
  }

  if (!drawData) {
    return (
      <ErrorPage
        code="UNKNOWN_ERROR"
        message="드로우 데이터를 불러오지 못했습니다."
      />
    );
  }

  return (
    <Wrapper className="pt-m pb-3xl">
      <SaleDetailLayout
        left={<SaleDetailMain hasStickyTopBar={false} />}
        right={<SaleDrawDetailSidebar />}
        bottom={
          <>
            <RelatedPopup />
            <RecommendedPopup />
          </>
        }
      />
    </Wrapper>
  );
}
