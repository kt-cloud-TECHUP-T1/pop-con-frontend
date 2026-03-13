// 드로우 결과 확인 모달

'use client';

import Modal, { ModalBody, ModalFooter } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import type { DrawResult } from '@/features/mypage/draws/services/confirm-draw-result';
import { Typography } from '@/components/ui/typography';

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
      showClose={false}
      size="sm"
      srTitle="드로우 결과"
    >
      <ModalBody className="flex flex-col items-center">
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
          <div className="flex w-full flex-col items-center">
            <div className="h-[200px] w-[200px] bg-[#D9D9D9]" aria-hidden />
            <div className="mt-2 text-center">
              <Typography
                variant="title-1"
                weight="bold"
                className="leading-[42px] text-[var(--neutral-30)]"
              >
                {revealedResult === 'won'
                  ? '당첨이에요!'
                  : '아쉽게도 낙첨되었어요'}
              </Typography>
              <Typography
                variant="title-1"
                weight="bold"
                className="leading-[42px] text-[var(--neutral-30)]"
              >
                {revealedResult === 'won'
                  ? '상위 0.4%의 운을 가지셨군요'
                  : '다음 기회를 노려봐요'}
              </Typography>
              <Typography
                variant="body-1"
                className="mt-2 leading-8 text-[var(--neutral-60)]"
              >
                자세한 정보는 마이페이지 {'>'} 내 티켓 또는
                <br />
                드로우 내역에서 확인할 수 있어요
              </Typography>
            </div>
          </div>
        )}
      </ModalBody>
      <ModalFooter className="mt-8 justify-center">
        <Button
          type="button"
          size="large"
          variant="secondary"
          onClick={onClose}
          disabled={isRevealing}
          className="w-full"
        >
          닫기
        </Button>
      </ModalFooter>
    </Modal>
  );
}
