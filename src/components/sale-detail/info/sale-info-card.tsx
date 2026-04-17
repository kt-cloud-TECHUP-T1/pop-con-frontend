'use client';

import SaleInfoPrice from './sale-info-price';
import SaleInfoCTA from './sale-info-cta';
import SaleScheduleInfo from './sale-schedule-info';
import { useParams } from 'next/navigation';
import { usePopupDetailQuery } from '../queries/use-popup-detail-query';
import { Box } from '@/components/ui/box';

export default function SaleInfoCard() {
  const params = useParams<{ popupId: string }>();
  const popupIdNumber = Number(params.popupId);
  const { data: popupData } = usePopupDetailQuery(popupIdNumber);

  return (
    <Box border="var(--line-3)" radius="ML" padding="MS">
      {popupData?.phaseType === 'AUCTION' && <SaleInfoPrice />}

      <SaleScheduleInfo />
      <SaleInfoCTA></SaleInfoCTA>
    </Box>
  );
}
