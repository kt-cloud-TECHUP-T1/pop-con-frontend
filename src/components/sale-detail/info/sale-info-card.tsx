'use client';

import SaleInfoPrice from './sale-info-price';
import SaleInfoCTA from './sale-info-cta';
import SaleScheduleInfo from './sale-schedule-info';
import { usePopupStore } from '../stores/popup-store';

export default function SaleInfoCard() {
  const phaseType = usePopupStore((state) => state.data?.phaseType);

  return (
    <div className="border border-[var(--line-3)] rounded-ml p-ms">
      {phaseType === 'AUCTION' && <SaleInfoPrice />}

      <SaleScheduleInfo />
      <SaleInfoCTA></SaleInfoCTA>
    </div>
  );
}
