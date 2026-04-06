'use client';

import SaleInfoPrice from './sale-info-price';
import SaleInfoCTA from './sale-info-cta';
import { useEffect } from 'react';
import { getDrawDetail } from '@/app/api/sale-detail/get-draw-detail';
import SaleScheduleInfo from './sale-schedule-info';
import { usePopupStore } from '../stores/popup-store';
import { useDrawStore } from '../stores/draw-store';

export default function SaleInfoCard() {
  const phaseType = usePopupStore((state) => state.data?.phaseType);
  const connetedDrawId = usePopupStore((state) => state.data?.drawId);
  const setDrawData = useDrawStore((state) => state.setDrawData);

  useEffect(() => {
    if (phaseType !== 'AUCTION' || !connetedDrawId) return;

    const fetchDraw = async () => {
      try {
        const data = await getDrawDetail(String(connetedDrawId));
        setDrawData(data);
      } catch {
        throw new Error('DRAW 조회 중 오류가 발생했습니다. in SaleInfoCard');
      }
    };

    fetchDraw();
  }, [phaseType, connetedDrawId]);

  return (
    <div className="border border-[var(--line-3)] rounded-ml p-ms">
      {phaseType === 'AUCTION' && <SaleInfoPrice />}

      <SaleScheduleInfo />
      <SaleInfoCTA></SaleInfoCTA>
    </div>
  );
}
