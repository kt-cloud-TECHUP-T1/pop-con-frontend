import { useQuery } from '@tanstack/react-query';
import { getQueueStatus } from '@/features/queue/services/get-queue-status';
import { isQueuePollingStatus } from '@/features/queue/types/queue';

const DEFAULT_QUEUE_POLLING_INTERVAL = 2_000;
const MIN_QUEUE_POLLING_INTERVAL = 1_000;
const MAX_QUEUE_POLLING_INTERVAL = 30_000;

export function useQueueStatus(queueId: string | null) {
  return useQuery({
    queryKey: ['queue-status', queueId],
    enabled: Boolean(queueId),
    queryFn: ({ signal }) => {
      if (!queueId) throw new Error('queueId is required');
      return getQueueStatus(queueId, signal);
    },
    refetchInterval: (query) => {
      const data = query.state.data;

      if (!data) {
        return DEFAULT_QUEUE_POLLING_INTERVAL;
      }

      const nextInterval =
        typeof data.pollIntervalMs === 'number' &&
        Number.isFinite(data.pollIntervalMs) &&
        data.pollIntervalMs > 0
          ? data.pollIntervalMs
          : DEFAULT_QUEUE_POLLING_INTERVAL;

      return isQueuePollingStatus(data.status)
        ? Math.min(
            MAX_QUEUE_POLLING_INTERVAL,
            Math.max(MIN_QUEUE_POLLING_INTERVAL, nextInterval)
          )
        : false;
    },
  });
}
