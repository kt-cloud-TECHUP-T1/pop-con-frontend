import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import type { QueueStatusResponse } from '@/features/queue/types/queue';

interface UseQueueOptions {
  queueToken: string;
  onActive: () => void; // ACTIVE 전환 시 퀴즈 페이지로 이동 등 처리
}

export function useQueue({ queueToken, onActive }: UseQueueOptions) {
  const { data } = useQuery({
    queryKey: ['queue-status', queueToken],
    queryFn: async () => {
      const response = await fetch('/api/queue/status', {
        headers: { 'X-Queue-Token': queueToken },
      });
      return response.json() as Promise<QueueStatusResponse>;
    },
    refetchInterval: (query) => {
      if (query.state.data?.data?.status === 'ACTIVE') return false;
      return 3000;
    },
    enabled: !!queueToken,
    retry: false,
  });

  useEffect(() => {
    if (data?.data?.status === 'ACTIVE') {
      onActive();
    }
  }, [data, onActive]);

  const queueData = data?.data;
  const position = queueData?.status === 'WAITING' ? queueData.position : null;
  const estimatedWaitSeconds =
    queueData?.status === 'WAITING' ? queueData.estimatedWaitSeconds : null;

  return { position, estimatedWaitSeconds };
}
