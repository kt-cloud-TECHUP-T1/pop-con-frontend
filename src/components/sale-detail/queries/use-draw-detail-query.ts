import { useQuery } from '@tanstack/react-query';
import { getDrawDetail } from '@/lib/api/draw/get-draw-detail';

export function useDrawDetailQuery(drawId: number) {
  return useQuery({
    queryKey: ['draw-detail', drawId],
    queryFn: () => getDrawDetail(drawId),
    enabled: !Number.isNaN(drawId) && Boolean(drawId),
  });
}
