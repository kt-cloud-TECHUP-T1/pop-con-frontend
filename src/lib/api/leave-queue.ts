import { QUEUE_ERROR_CODES, QUEUE_ERROR_MESSAGES } from '@/constants/queue';
import { LeaveQueueResponse } from '@/types/queue/queue';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

function createLeaveQueueErrorResponse(
  code: 'Q002' | 'Q003' | 'S001'
): LeaveQueueResponse {
  return {
    code,
    message: QUEUE_ERROR_MESSAGES[code],
    data: null,
  };
}

export async function leaveQueue(
  queueToken: string
): Promise<LeaveQueueResponse> {
  //queueToken이 없으면 아예 fetch 안 보내고 바로 Q002 반환 브라우저 뒤로가기 우려
  if (!queueToken) {
    return createLeaveQueueErrorResponse(
      QUEUE_ERROR_CODES.QUEUE_TOKEN_REQUIRED
    );
  }

  try {
    const response = await fetch(`${API_BASE_URL.replace(/\/+$/, '')}/queues`, {
      method: 'DELETE',
      headers: {
        'X-Queue-Token': queueToken,
      },
      cache: 'no-store',
    });

    const result = (await response.json()) as LeaveQueueResponse;

    return result;
  } catch (error) {
    console.error('leaveQueue error:', error);

    return createLeaveQueueErrorResponse(QUEUE_ERROR_CODES.SERVER_ERROR);
  }
}

// 브라우저 뒤로가기용 (fire-and-forget, keepalive 보장)
export function leaveQueueBeacon(queueToken: string): void {
  if (!queueToken) return;

  fetch(`${API_BASE_URL.replace(/\/+$/, '')}/queues`, {
    method: 'DELETE',
    headers: { 'X-Queue-Token': queueToken },
    keepalive: true,
  });
}
