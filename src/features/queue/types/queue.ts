// TODO 백엔드 명세 나오면 타입, 필드 등 맞출 필요 있음

import { ApiResponse } from '@/types/api/common';

export type QueueStatus = 'WAITING' | 'READY' | 'EXPIRED' | 'CANCELLED';

export interface QueueStatusResponse {
  queueId: string;
  status: QueueStatus;
  rank: number | null;
  aheadCount: number | null;
  progressPercent: number;
  pollIntervalMs?: number;
  nextUrl?: string | null;
  message?: string | null;
}

export type QueueStatusApiResponse = ApiResponse<QueueStatusResponse>;

export const isQueuePollingStatus = (status: QueueStatus) =>
  status === 'WAITING';
