'use client';

import { SaleDetailLayout } from '@/components/layout/sale-detail-layout';
import { Wrapper } from '@/components/layout/wrapper';
import { useParams } from 'next/navigation';
import { RelatedPopup } from '../popup/related-popup';
import { RecommendedPopup } from '../popup/recommended-popup';
import { SaleDetailMain } from './sale-detail-main';
import SaleDrawDetailSidebar from '../info/sale-draw-detail-sidebar';
import { getPopupDetail } from '@/lib/api/popup/get-popup-detail';
import { getDrawDetail } from '@/app/api/sale-detail/get-draw-detail';
import { useDrawStore } from '../stores/draw-store';
import { usePopupStore } from '../stores/popup-store';
import { useEffect, useState } from 'react';
import { DrawData } from '@/types/sale-detail';

export default function DrawContainer() {
  const params = useParams<{ popupId: string }>();
  const popupId = params.popupId;
  const popupIdNumber = Number(popupId);
  const { setPopupData, resetPopupData } = usePopupStore();
  const { setDrawData, resetDrawData } = useDrawStore();
  const popupData = usePopupStore((state) => state.data);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    //기존 스토어 데이터 삭제
    resetDrawData();
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

        const DrawDetail: DrawData = await getDrawDetail(auctionId);
        if (!isMounted) return;
        setDrawData(DrawDetail); //draw 초기 데이터 저장
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      disconnectStream?.();
      resetDrawData();
      resetPopupData();
    };
  }, [popupIdNumber, popupId]);

  if (isLoading) {
    return <div>로딩중...</div>;
  }

  if (error || !popupData || !popupId) {
    return <div>{error ?? '데이터를 불러오지 못했습니다.'}</div>;
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
      ></SaleDetailLayout>
    </Wrapper>
  );
}
