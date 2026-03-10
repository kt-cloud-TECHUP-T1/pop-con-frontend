'use client';

import { Typography } from '@/components/ui/typography';
import { useEffect, useRef, useState } from 'react';

// type PhaseStatus = 'UPCOMING' | 'OPEN' | 'CLOSED';

interface SaleTimeCountBarProps {
  phaseStatus: string;
  auctionCloseAt: string;
  serverNow: string;
}

function getInitialRemaining(targetISOString: string, serverNow: string) {
  return Math.max(
    0,
    new Date(targetISOString).getTime() - new Date(serverNow).getTime()
  );
}

function formatHHMMSS(ms: number) {
  const displayMs = Math.max(0, ms - 1);
  const totalSeconds = Math.floor(displayMs / 1000);

  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function useCountdown(targetISOString: string, serverNow: string) {
  const [remaining, setRemaining] = useState(() =>
    getInitialRemaining(targetISOString, serverNow)
  );
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const targetTime = new Date(targetISOString).getTime();
    const serverOffset = new Date(serverNow).getTime() - Date.now();

    const tick = () => {
      const correctedNow = Date.now() + serverOffset;
      const diff = Math.max(0, targetTime - correctedNow);

      setRemaining(diff);

      if (diff <= 0) return;

      const msUntilNextSecond = 1000 - (Date.now() % 1000);
      timerRef.current = setTimeout(tick, msUntilNextSecond);
    };

    tick();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [targetISOString, serverNow]);

  return remaining;
}

export default function SaleTimeCountBar({
  phaseStatus,
  auctionCloseAt,
  serverNow,
}: SaleTimeCountBarProps) {
  const remaining = useCountdown(auctionCloseAt, serverNow);

  if (phaseStatus === 'UPCOMING') return null;

  return (
    <div className="sticky top-0 z-50 bg-[var(--content-high)] py-xs text-center">
      {phaseStatus === 'OPEN' && (
        <Typography variant="body-1" weight="bold" className="text-white">
          경매 종료까지 남은 시간 {formatHHMMSS(remaining)}
        </Typography>
      )}

      {phaseStatus === 'CLOSED' && (
        <Typography variant="body-1" weight="bold" className="text-white">
          경매가 종료되었습니다.
        </Typography>
      )}
    </div>
  );
}
