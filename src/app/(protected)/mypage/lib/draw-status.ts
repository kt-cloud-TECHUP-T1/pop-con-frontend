import type {
  ActivityStatusTone,
  DrawHistoryItem,
} from '@/app/(protected)/mypage/types';

export type DrawStatusFilter =
  | 'won'
  | 'notWon'
  | 'inProgress'
  | 'waitingResult'
  | 'pendingResult';

export const DRAW_STATUS_FILTERS: { value: DrawStatusFilter; label: string }[] =
  [
    { value: 'won', label: '드로우 당첨' },
    { value: 'notWon', label: '드로우 미당첨' },
    { value: 'inProgress', label: '드로우 진행중' },
    { value: 'waitingResult', label: '결과 발표 대기' },
    { value: 'pendingResult', label: '결과 확인하기' },
  ];

const STATUS_LABEL_MAP: Record<DrawStatusFilter, string> = {
  won: '드로우 당첨',
  notWon: '드로우 미당첨',
  inProgress: '드로우 진행중',
  waitingResult: '결과 발표 대기',
  pendingResult: '결과 확인하기',
};

const STATUS_TONE_MAP: Record<DrawStatusFilter, ActivityStatusTone> = {
  won: 'success',
  notWon: 'danger',
  inProgress: 'neutral',
  waitingResult: 'warning',
  pendingResult: 'warning',
};

type DrawStatusInput = Pick<DrawHistoryItem, 'displayStatus'>;

export function getDrawStatusFilter(item: DrawStatusInput): DrawStatusFilter {
  switch (item.displayStatus) {
    case '진행 중':
      return 'inProgress';
    case '추첨 대기':
    case '결과 발표 대기':
      return 'waitingResult';
    case '결과 확인하기':
      return 'pendingResult';
    case '당첨':
    case '티켓 발급 완료':
      return 'won';
    case '미당첨':
      return 'notWon';
    default:
      return 'inProgress';
  }
}

export function getDrawStatusLabel(item: DrawStatusInput): string {
  return STATUS_LABEL_MAP[getDrawStatusFilter(item)];
}

export function getDrawStatusTone(item: DrawStatusInput): ActivityStatusTone {
  return STATUS_TONE_MAP[getDrawStatusFilter(item)];
}
