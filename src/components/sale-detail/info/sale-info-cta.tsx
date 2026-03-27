'use client';

import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { formatDateWithWeekdayTime } from '@/lib/utils';
import { DrawSaleInfoCTAProps, SaleInfoCTAProps } from '@/types/sale-detail';
import useCountdown from '../hooks/use-countdown';

export default function SaleInfoCTA(props: SaleInfoCTAProps) {
  const { phaseType, phaseStatus, serverTime } = props;

  if (phaseType === 'AUCTION') {
    const { auctionOpenAt, auctionStatus, buttonStatus, connetedDrawOpenAt } =
      props;
    switch (buttonStatus) {
      case 'ENABLED':
        return (
          <Button size="large" variant="primary" className="w-full">
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
  return <DrawCTA {...props} />;
}

function DrawCTA({
  drawOpenAt,
  drawCloseAt,
  serverTime,
}: DrawSaleInfoCTAProps) {
  const remaining = useCountdown(drawOpenAt, serverTime);
  const isOpen = remaining <= 0;

  return (
    <Button
      size="large"
      variant="primary"
      disabled={!isOpen}
      className="w-full"
    >
      <Typography variant="label-1">
        {isOpen ? '드로우 응모하기' : formatDateWithWeekdayTime(drawOpenAt)}
      </Typography>
    </Button>
  );
}
