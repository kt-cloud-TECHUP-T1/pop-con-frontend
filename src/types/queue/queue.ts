export type QueueStatus = 'ACTIVE' | 'WAITING' | 'BLOCKED';

export interface AuctionQueueActiveData {
  status: 'ACTIVE';
  queueToken: string;
}

export interface AuctionQueueWaitingData {
  status: 'WAITING';
  queueToken: string;
  position: number;
  estimatedWaitSeconds: number;
  pollAfterMs: number;
}

export interface AuctionQueueBlockedData {
  status: 'BLOCKED';
  blockedUntil: string;
}

export type EnterAuctionQueueSuccessData =
  | AuctionQueueActiveData
  | AuctionQueueWaitingData;

export interface EnterAuctionQueueSuccessResponse {
  code: 'SUCCESS';
  message: string;
  data: EnterAuctionQueueSuccessData;
}

export interface EnterAuctionQueueBlockedResponse {
  code: 'Q001';
  message: string;
  data: AuctionQueueBlockedData;
}

export interface EnterAuctionQueueErrorResponse {
  code: 'C001' | 'A002' | 'A003' | 'S001';
  message: string;
  data: null;
}

export type EnterAuctionQueueResponse =
  | EnterAuctionQueueSuccessResponse
  | EnterAuctionQueueBlockedResponse
  | EnterAuctionQueueErrorResponse;

export interface LeaveQueueSuccessResponse {
  code: 'SUCCESS';
  message: string;
  data: null;
}

export interface LeaveQueueErrorResponse {
  code: 'Q002' | 'Q003' | 'S001';
  message: string;
  data: null;
}

export type LeaveQueueResponse =
  | LeaveQueueSuccessResponse
  | LeaveQueueErrorResponse;
