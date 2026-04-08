// queries/use-current-draw-detail.ts
import { useParams } from 'next/navigation';
import { usePopupDetailQuery } from './use-popup-detail-query';
import { useDrawDetailQuery } from './use-draw-detail-query';

export function useCurrentDrawDetail() {
  const params = useParams<{ popupId: string }>();
  const popupIdNumber = Number(params.popupId);

  const popupQuery = usePopupDetailQuery(popupIdNumber);
  const drawId = popupQuery.data?.drawId;

  const drawQuery = useDrawDetailQuery(drawId ?? NaN);

  return {
    popupQuery,
    drawId,
    ...drawQuery,
  };
}
