import type { ActivityStatusTone } from '@/features/mypage/types/activity';
import type { DrawResult } from '@/features/mypage/draws/services/confirm-draw-result';

type DrawResultBadge = {
  label: string;
  tone: ActivityStatusTone;
};

export function getResultBadge(result: DrawResult): DrawResultBadge {
  if (result === 'won') {
    return {
      label: '드로우 당첨',
      tone: 'success',
    };
  }

  return {
    label: '드로우 미당첨',
    tone: 'danger',
  };
}
