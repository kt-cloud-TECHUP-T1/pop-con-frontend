import { useEffect, useRef, useState } from 'react';
import { getInitialRemaining } from '../utils/sale-detail-utils';

export default function useCountdown(
  targetISOString: string,
  serverNow: string
) {
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

      const msUntilNextSecond = 1000 - (correctedNow % 1000);
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
