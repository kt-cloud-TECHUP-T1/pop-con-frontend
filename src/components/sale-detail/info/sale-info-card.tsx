'use client';

import SaleInfoPrice from './sale-info-price';
import SaleInfoCTA from './sale-info-cta';
import SaleScheduleInfo from './sale-schedule-info';
import { useParams } from 'next/navigation';
import { usePopupDetailQuery } from '../queries/use-popup-detail-query';

export default function SaleInfoCard() {
  const params = useParams<{ popupId: string }>();
  const popupIdNumber = Number(params.popupId);
  const { data: popupData } = usePopupDetailQuery(popupIdNumber);

  return (
    <div className="border border-[var(--line-3)] rounded-ml p-ms">
      {popupData?.phaseType === 'AUCTION' && <SaleInfoPrice />}

      <SaleScheduleInfo />
      <SaleInfoCTA></SaleInfoCTA>
    </div>
  );
}
