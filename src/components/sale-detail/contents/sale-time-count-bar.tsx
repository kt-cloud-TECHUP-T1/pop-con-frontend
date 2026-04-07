'use client';

import { Typography } from '@/components/ui/typography';
import useCountdown from '../hooks/use-countdown';
import { splitRemainingTime } from '../utils/sale-detail-utils';
import { useAuctionStore } from '../stores/auction-store';

export default function SaleTimeCountBar() {
  const auctionData = useAuctionStore((state) => state.liveData);
  const remaining = useCountdown(
    auctionData?.auctionCloseAt ?? '',
    auctionData?.serverTime ?? ''
  );
  const { hours, minutes, seconds } = splitRemainingTime(remaining);

  if (!auctionData) return null;
  if (auctionData.auctionStatus === 'SCHEDULED') return null;

  return (
    <div className="sticky top-20.5 z-50 bg-[var(--content-high)] py-xs text-center">
      {auctionData.auctionStatus === 'CLOSED' ? (
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
