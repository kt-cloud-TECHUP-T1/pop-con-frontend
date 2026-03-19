import { API_MESSAGES, API_RESPONSE_CODE } from '@/constants/api';
import {
  QueueStatusApiResponse,
  QueueStatusResponse,
} from '@/features/queue/types/queue';

const QUEUE_STATUS_ENDPOINT = '/api/queue/status';

export async function getQueueStatus(
  queueId: string,
  signal?: AbortSignal
): Promise<QueueStatusResponse> {
  const response = await fetch(
    // TODO 백엔드 명세 나오면 응답 주소에 맞춰 변경할 필요 있음
    `${QUEUE_STATUS_ENDPOINT}?queueId=${encodeURIComponent(queueId)}`,
    {
      method: 'GET',
      cache: 'no-store',
      signal,
    }
  );

  const result = (await response.json()) as Partial<QueueStatusApiResponse>;

  if (
    !response.ok ||
    result.code !== API_RESPONSE_CODE.STATUS.SUCCESS ||
    !result.data
  ) {
    throw new Error(result.message ?? API_MESSAGES.COMMON.SERVER_ERROR);
  }

  return result.data;
}
