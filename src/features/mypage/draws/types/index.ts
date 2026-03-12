import type { ActivityStatusTone } from '@/features/mypage/types/activity';
import type { DrawResult } from '@/features/mypage/draws/services/confirm-draw-result';

export type DrawStatusFilter =
  | 'won'
  | 'notWon'
  | 'inProgress'
  | 'pendingResult';

export type DrawHistoryItem = {
  id: number;
  title: string;
  amount: number;
  paidAt: string;
  statusFilter: DrawStatusFilter;
  statusLabel: string;
  statusTone: ActivityStatusTone;
  revealResult?: DrawResult;
};
