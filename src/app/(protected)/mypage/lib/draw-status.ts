import type { ActivityStatusTone } from '@/app/(protected)/mypage/types';

export type DrawStatusFilter =
  | 'won'
  | 'notWon'
  | 'inProgress'
  | 'pendingResult';

export const DRAW_STATUS_FILTERS: { value: DrawStatusFilter; label: string }[] =
  [
    { value: 'won', label: '드로우 당첨' },
    { value: 'notWon', label: '드로우 미당첨' },
    { value: 'inProgress', label: '드로우 진행중' },
    { value: 'pendingResult', label: '결과 확인 대기중' },
  ];

const STATUS_LABEL_MAP: Record<DrawStatusFilter, string> = {
  won: '드로우 당첨',
  notWon: '드로우 미당첨',
  inProgress: '드로우 진행중',
  pendingResult: '결과 확인 대기중',
};

const STATUS_TONE_MAP: Record<DrawStatusFilter, ActivityStatusTone> = {
  won: 'success',
  notWon: 'danger',
  inProgress: 'neutral',
  pendingResult: 'warning',
};

export function getDrawStatusFilter(
  status: string | null | undefined
): DrawStatusFilter {
  const s = (status ?? '').trim().toUpperCase();
  if (s === 'WON' || s === '당첨') return 'won';
  if (s === 'LOST' || s === '미당첨') return 'notWon';
  if (s === 'IN_PROGRESS' || s === '진행중') return 'inProgress';
  return 'pendingResult';
}

export function getDrawStatusLabel(status: string): string {
  return STATUS_LABEL_MAP[getDrawStatusFilter(status)];
}

export function getDrawStatusTone(status: string): ActivityStatusTone {
  return STATUS_TONE_MAP[getDrawStatusFilter(status)];
}
