import type {
  DrawHistoryItem,
  DrawStatusFilter,
} from '@/features/mypage/draws/types';

export const drawStatusFilters: { value: DrawStatusFilter; label: string }[] = [
  { value: 'won', label: '드로우 당첨' },
  { value: 'notWon', label: '드로우 미당첨' },
  { value: 'inProgress', label: '드로우 진행중' },
  { value: 'pendingResult', label: '결과 확인 대기중' },
];

export const initialDrawHistory: DrawHistoryItem[] = [
  {
    id: 1,
    title: 'Title',
    amount: 31000,
    paidAt: '2026.02.17',
    statusFilter: 'won',
    statusLabel: '드로우 당첨',
    statusTone: 'success',
  },
  {
    id: 2,
    title: 'Title',
    amount: 14000,
    paidAt: '2026.02.14',
    statusFilter: 'notWon',
    statusLabel: '드로우 미당첨',
    statusTone: 'danger',
  },
  {
    id: 3,
    title: 'Title',
    amount: 18000,
    paidAt: '2026.02.11',
    statusFilter: 'pendingResult',
    statusLabel: '결과 확인 대기중',
    statusTone: 'warning',
    revealResult: 'won',
  },
  {
    id: 4,
    title: 'Title',
    amount: 26000,
    paidAt: '2026.02.08',
    statusFilter: 'inProgress',
    statusLabel: '드로우 진행중',
    statusTone: 'neutral',
  },
];
