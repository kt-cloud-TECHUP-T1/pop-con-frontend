export type QueueConnectionStatus =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'error';

export type QueueStatus = 'waiting' | 'ready' | 'admitted' | 'expired';

export interface QueueSnapshot {
  queueId: string;
  auctionId: string;
  userId: string;
  position: number;
  totalWaiting: number;
  estimatedWaitMinutes: number;
  status: QueueStatus;
  roomId?: string;
  lastUpdatedAt: string;
}

export interface QueueJoinPayload {
  auctionId: string;
  userId: string;
}

export interface QueueServerEventMap {
  'queue:joined': QueueSnapshot;
  'queue:update': Partial<QueueSnapshot>;
  'queue:ready': Pick<QueueSnapshot, 'roomId' | 'lastUpdatedAt'>;
  'queue:expired': Pick<QueueSnapshot, 'lastUpdatedAt'>;
}
