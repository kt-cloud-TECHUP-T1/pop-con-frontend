import type {
  ActivityStatusTone,
  DrawHistoryItem,
} from '@/app/(protected)/mypage/types';

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

type DrawStatusInput = Pick<
  DrawHistoryItem,
  'status' | 'resultAvailable' | 'resultChecked' | 'clickable'
>;

export function getDrawStatusFilter(item: DrawStatusInput): DrawStatusFilter {
  if (item.status === 'WINNER') return 'won';
  if (item.status === 'FAILED') return 'notWon';
  if (item.resultAvailable && !item.resultChecked && item.clickable) {
    return 'pendingResult';
  }
  return 'inProgress';
}

export function getDrawStatusLabel(item: DrawStatusInput): string {
  return STATUS_LABEL_MAP[getDrawStatusFilter(item)];
}

export function getDrawStatusTone(item: DrawStatusInput): ActivityStatusTone {
  return STATUS_TONE_MAP[getDrawStatusFilter(item)];
}
