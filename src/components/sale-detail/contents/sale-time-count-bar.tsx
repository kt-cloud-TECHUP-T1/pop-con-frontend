'use client';

import { Typography } from '@/components/ui/typography';
import useCountdown from '../hooks/use-countdown';
import { splitRemainingTime } from '../utils/sale-detail-utils';

interface SaleTimeCountBarProps {
  auctionStatus: string;
  auctionCloseAt: string;
  serverTime: string;
}

export default function SaleTimeCountBar({
  auctionStatus,
  auctionCloseAt,
  serverTime,
}: SaleTimeCountBarProps) {
  const remaining = useCountdown(auctionCloseAt, serverTime);
  const { hours, minutes, seconds } = splitRemainingTime(remaining);

  if (auctionStatus === 'SCHEDULED') return null;

  return (
    <div className="sticky top-0 z-50 bg-[var(--content-high)] py-xs text-center">
      {auctionStatus === 'CLOSED' ? (
        <Typography variant="body-1" weight="bold" className="text-white">
          경매가 종료되었습니다.
        </Typography>
      ) : (
        <Typography variant="body-1" weight="bold" className="text-white">
          경매 종료까지 남은 시간 {hours} : {minutes} : {seconds}
        </Typography>
      )}
    </div>
  );
}
