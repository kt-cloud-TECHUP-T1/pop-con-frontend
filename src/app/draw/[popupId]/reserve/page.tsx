// 드로우

import { Wrapper } from '@/components/layout/wrapper';
import { DrawReservePageClient } from './components/draw-reserve-page-client';

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
