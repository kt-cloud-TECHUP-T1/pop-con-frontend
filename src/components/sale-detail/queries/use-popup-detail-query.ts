import { useQuery } from '@tanstack/react-query';
import { getPopupDetail } from '@/lib/api/popup/get-popup-detail';

export function usePopupDetailQuery(popupId: number) {
  return useQuery({
    queryKey: ['popup-detail', popupId],
    queryFn: () => getPopupDetail(popupId),
    enabled: !Number.isNaN(popupId),
  });
}
