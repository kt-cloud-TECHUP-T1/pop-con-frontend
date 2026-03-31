import { ApiResponse } from '@/types/api/common';

// 진입 API 응답 (POST /queues/draws/{drawId})
type QueueEntryActiveData = { status: 'ACTIVE'; queueToken: string };
type QueueEntryWaitingData = {
  status: 'WAITING';
  queueToken: string;
  position: number;
  estimatedWaitSeconds: number;
  pollAfterMs: number;
};
type QueueEntryBlockedData = { status: 'BLOCKED'; blockedUntil: string };

// 상태 폴링 응답 data (GET /queues/status)
type QueueStatusWaitingData = {
  status: 'WAITING';
  position: number;
  estimatedWaitSeconds: number;
  pollAfterMs: number;
};
type QueueStatusActiveData = { status: 'ACTIVE' };

//
type QueueEntryData =
  | QueueEntryActiveData
  | QueueEntryWaitingData
  | QueueEntryBlockedData;
type QueueStatusData = QueueStatusWaitingData | QueueStatusActiveData;

export type QueueEntryResponse = ApiResponse<QueueEntryData>;
export type QueueStatusResponse = ApiResponse<QueueStatusData>;
