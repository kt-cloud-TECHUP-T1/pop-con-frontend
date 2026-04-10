import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import type { QueueStatusResponse } from '@/features/queue/types/queue';
import { useAuthStore } from '@/features/auth/stores/auth-store';

interface UseQueueOptions {
  queueToken: string;
  onActive: () => void; // ACTIVE 전환 시 퀴즈 페이지로 이동 등 처리
}

export function useQueue({ queueToken, onActive }: UseQueueOptions) {
  const initialPositionRef = useRef<number | null>(null);
  const [progress, setProgress] = useState(0);
  const accessToken = useAuthStore((state) => state.accessToken);

  const { data } = useQuery({
    queryKey: ['queue-status', queueToken],
    queryFn: async () => {
      const response = await fetch('/api/queue/status', {
        headers: {
          'X-Queue-Token': queueToken,
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Queue status fetch failed: ${response.status}`);
      }

      return response.json() as Promise<QueueStatusResponse>;
    },
    refetchInterval: (query) => {
      if (query.state.data?.data?.status === 'ACTIVE') return false;
      return Math.max(query.state.data?.data?.pollAfterMs ?? 3000, 1000);
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

  // 최초 position 저장
  useEffect(() => {
    if (position !== null) {
      if (initialPositionRef.current === null) {
        initialPositionRef.current = position;
      }
      setProgress(
        ((initialPositionRef.current - position) / initialPositionRef.current) *
          100
      );
    }

    if (data?.data?.status === 'ACTIVE') {
      setProgress(100);
    }
  }, [data, position]);

  return { position, estimatedWaitSeconds, progress };
}
