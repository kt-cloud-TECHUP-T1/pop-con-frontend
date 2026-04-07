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
    return <div>유효하지 않은 popupId입니다.</div>;
  }

  if (isPopupPending || (drawId && isDrawPending)) {
    return <div>로딩중...</div>;
  }

  if (isPopupError) {
    return (
      <div>
        {popupError instanceof Error
          ? popupError.message
          : '팝업 조회에 실패했습니다.'}
      </div>
    );
  }

  if (!popupData) {
    return <div>팝업 데이터를 불러오지 못했습니다.</div>;
  }

  if (!drawId) {
    return <div>유효한 drawId가 없습니다.</div>;
  }

  if (isDrawError) {
    return (
      <div>
        {drawError instanceof Error
          ? drawError.message
          : '드로우 조회에 실패했습니다.'}
      </div>
    );
  }

  if (!drawData) {
    return <div>드로우 데이터를 불러오지 못했습니다.</div>;
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
