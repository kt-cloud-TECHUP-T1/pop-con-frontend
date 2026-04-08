// 드로우

import SaleTimeCountBar from '@/components/sale-detail/contents/sale-time-count-bar';
import { Wrapper } from '@/components/layout/wrapper';
import { DrawReservePageClient } from './components/draw-reserve-page-client';
import { mockReserveData } from '@/app/auction/[popupId]/reserve/mock-reserve-data';

export default async function DrawReservePage({
  params,
}: {
  params: Promise<{ popupId: string }>;
}) {
  const { popupId } = await params;

  return (
    <>
      <Wrapper className="pt-8 pb-3xl">
        <DrawReservePageClient drawId={popupId} />
      </Wrapper>
    </>
  );
}
