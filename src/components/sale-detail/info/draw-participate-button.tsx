'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { usePopupDetailCollector } from '@/features/anti-macro';

interface DrawParticipateButtonProps {
  popupId: string;
  phaseType: string;
}

export function DrawParticipateButton({ popupId, phaseType }: DrawParticipateButtonProps) {
  const { submitSignals } = usePopupDetailCollector();

  const href =
    phaseType === 'AUCTION'
      ? `/auction/${popupId}/reserve`
      : `/draw/${popupId}/reserve`;

  const label = phaseType === 'AUCTION' ? '프리미엄 경매' : '드로우';

  const handleClick = () => {
    submitSignals();
  };

  return (
    <Link href={href}>
      <Button size="large" className="w-full" onClick={handleClick}>
        <Typography variant="label-1">{label} 참여하기</Typography>
      </Button>
    </Link>
  );
}
