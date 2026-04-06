'use client';

import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { formatDateWithWeekdayTime } from '@/lib/utils';
import { DrawSaleInfoCTAProps, SaleInfoCTAProps } from '@/types/sale-detail';
import { useDetailPageCollector } from '@/features/anti-macro';
import useCountdown from '../hooks/use-countdown';

export default function SaleInfoCTA(props: SaleInfoCTAProps) {
  const { phaseType, phaseStatus, serverTime } = props;
  const page = phaseType === 'AUCTION' ? 'dutch-auction-detail' as const : 'popup-detail' as const;
  const { submitSignals } = useDetailPageCollector({ page });

  if (phaseType === 'AUCTION') {
    const { auctionOpenAt, auctionStatus, buttonStatus, connetedDrawOpenAt } =
      props;
    switch (buttonStatus) {
      case 'ENABLED':
        return (
          <Button size="large" variant="primary" className="w-full" onClick={() => submitSignals()}>
            <Typography variant="label-1">프리미엄 경매 참여하기</Typography>
          </Button>
        );
      case 'WAITING':
        return (
          <Button size="large" disabled className="w-full">
            <Typography variant="label-1">
              {formatDateWithWeekdayTime(auctionOpenAt)} 경매오픈
            </Typography>
          </Button>
        );
      case 'SOLD_OUT':
        return (
          <Button size="large" disabled className="w-full">
            <Typography variant="label-1">매진</Typography>
          </Button>
        );
      case 'ENDED':
        return (
          <Button size="large" disabled className="w-full">
            <Typography variant="label-1">
              {connetedDrawOpenAt
                ? `${formatDateWithWeekdayTime(connetedDrawOpenAt)} 드로우 오픈`
                : '판매 종료'}
            </Typography>
          </Button>
        );
      default:
        return null;
    }
  }
  return <DrawCTA {...props} onSubmitSignals={submitSignals} />;
}

function DrawCTA({
  drawOpenAt,
  drawCloseAt,
  serverTime,
  onSubmitSignals,
}: DrawSaleInfoCTAProps & { onSubmitSignals: () => Promise<void> }) {
  const remaining = useCountdown(drawOpenAt, serverTime);
  const isOpen = remaining <= 0;

  return (
    <Button
      size="large"
      variant="primary"
      disabled={!isOpen}
      className="w-full"
      {...(isOpen && { onClick: () => onSubmitSignals() })}
    >
      <Typography variant="label-1">
        {isOpen ? '드로우 응모하기' : formatDateWithWeekdayTime(drawOpenAt)}
      </Typography>
    </Button>
  );
}
