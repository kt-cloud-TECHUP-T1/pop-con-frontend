'use client';

import Lottie from 'react-lottie-player';
import PopcornPrize from '../../../../../../../public/lottie/Popcorn_Prize.json';
import Modal from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';

export type DrawResult = 'lucky' | 'won' | 'notWon';

type DrawResultModalProps = {
  isOpen: boolean;
  onClose: () => void;
  result: DrawResult;
};

const RESULT_CONFIG: Record<
  DrawResult,
  { title: string; description: string }
> = {
  lucky: {
    title: '축하해요!',
    description: '상위 13%의 행운을 잡으셨어요',
  },
  won: {
    title: '축하해요!',
    description: '드로우에 당첨되었어요',
  },
  notWon: {
    title: '아쉽지만 이번 드로우에는',
    description: '당첨되지 않았어요',
  },
};

export default function DrawResultModal({
  isOpen,
  onClose,
  result,
}: DrawResultModalProps) {
  const { title, description } = RESULT_CONFIG[result];

  return (
    <Modal
      srTitle="드로우 결과"
      isOpen={isOpen}
      onClose={onClose}
      showClose={false}
      size="md"
    >
      <div className="flex flex-col items-center text-center">
        <Lottie
          animationData={PopcornPrize}
          play
          loop={false}
          style={{ width: 250, height: 180 }}
        />
        <Typography
          variant="title-1"
          weight="bold"
          className="mt-4 text-[var(--content-high)]"
        >
          {title}
          <br />
          {description}
        </Typography>
        <Typography
          variant="body-1"
          className="mt-2 whitespace-pre-line text-[var(--extra-low)] leading-6"
        >
          {'응모 내역은 마이페이지에서\n언제든지 확인할 수 있어요'}
        </Typography>
        <Button
          variant="primary"
          size="large"
          className="mt-8 w-full"
          onClick={onClose}
        >
          닫기
        </Button>
      </div>
    </Modal>
  );
}
