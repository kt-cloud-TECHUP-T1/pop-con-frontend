'use client';

import { Button } from '@/components/ui/button';
import Modal from '@/components/ui/modal';
import { ActivityStatusBadge } from '@/app/(protected)/mypage/components/activity-history/activity-status-badge';
import type { DrawResult } from '@/features/mypage/draws/services/confirm-draw-result';
import { getResultBadge } from '@/features/mypage/draws/utils/get-result-badge';

type DrawResultRevealModalProps = {
  isOpen: boolean;
  isRevealing: boolean;
  revealedResult: DrawResult | null;
  revealError: string | null;
  onClose: () => void;
};

export function DrawResultRevealModal({
  isOpen,
  isRevealing,
  revealedResult,
  revealError,
  onClose,
}: DrawResultRevealModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="드로우 결과 확인"
      showClose={false}
      size="sm"
    >
      <div className="flex flex-col items-center gap-4 py-2">
        {isRevealing ? (
          <>
            <span className="h-10 w-10 rounded-full border-2 border-[var(--line-2)] border-t-[var(--blue-50)] animate-spin" />
            <p className="text-sm text-[var(--neutral-30)]">
              결과를 확인하는 중입니다...
            </p>
          </>
        ) : revealError ? (
          <p className="text-sm text-[var(--red-50)]">{revealError}</p>
        ) : (
          revealedResult && (
            <>
              <ActivityStatusBadge
                label={getResultBadge(revealedResult).label}
                tone={getResultBadge(revealedResult).tone}
                className="animate-in fade-in zoom-in-95 duration-300"
              />
              <p className="text-sm text-[var(--neutral-30)]">
                {revealedResult === 'won'
                  ? '축하합니다! 드로우에 당첨되었어요.'
                  : '아쉽지만 이번 드로우는 미당첨이에요.'}
              </p>
            </>
          )
        )}
        <Button
          type="button"
          size="small"
          variant="primary"
          onClick={onClose}
          disabled={isRevealing}
          className="mt-2 w-full"
        >
          확인
        </Button>
      </div>
    </Modal>
  );
}
