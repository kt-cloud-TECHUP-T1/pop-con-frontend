'use client';
import { Typography } from '@/components/ui/typography';
import useCountdown from '../hooks/use-countdown';
import { splitRemainingTime } from '../utils/sale-detail-utils';
import { useAuctionLatestData } from '../stores/auction-store';

export default function OpenCountCard() {
  const auctionData = useAuctionLatestData();
  const remaining = useCountdown(
    auctionData?.auctionOpenAt ?? '',
    auctionData?.serverTime ?? ''
  );
  const { days, hours, minutes, seconds } = splitRemainingTime(remaining);

  if (auctionData?.auctionStatus !== 'SCHEDULED') return;
  return (
    <>
      <div className="p-ms bg-[var(--neutral-20)] text-[var(--white)] rounded-ml flex flex-col gap-xs items-center">
        <Typography variant="body-2" weight="regular">
          경매 오픈까지
        </Typography>
        <div className="flex items-start justify-center gap-xs text-white">
          <CountItem value={days} label="일" />
          <Separator />
          <CountItem value={hours} label="시간" />
          <Separator />
          <CountItem value={minutes} label="분" />
          <Separator />
          <CountItem value={seconds} label="초" />
        </div>
      </div>
    </>
  );
}

interface CountItemProps {
  value: string;
  label: string;
}

function CountItem({ value, label }: CountItemProps) {
  return (
    <div className="flex min-w-[64px] flex-col items-center gap-xs">
      <Typography
        variant="heading-1"
        weight="bold"
        className="tabular-nums text-white"
      >
        {value}
      </Typography>
      <Typography
        variant="caption-1"
        weight="regular"
        className="text-[var(--neutral-70)]"
      >
        {label}
      </Typography>
    </div>
  );
}

function Separator() {
  return (
    <Typography
      variant="heading-1"
      weight="bold"
      className="tabular-nums text-white"
    >
      :
    </Typography>
  );
}
