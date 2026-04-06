import { Icon } from '@/components/Icon/Icon';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { formatWon } from '@/lib/utils';
import { AuctionData, AuctionStatus } from '@/types/sale-detail';
import { formatSecondsToMMSS } from '../utils/sale-detail-utils';

interface SaleInfoPriceProps {
  auctionStatus: AuctionStatus;
  serverTime: string;
  auctionOpenAt: string;
  auctionCloseAt: string;
  remainingUntilOpenSeconds: number;
  remainingUntilCloseSeconds: number;
  startPrice: number;
  minimumPrice: number;
  currentPrice: number | null;
  nextPrice: number | null;
  discountAmount: number | null;
  priceDropUnit: number;
  priceDropIntervalSeconds: number;
  secondsUntilNextDrop: number;
  maxPurchaseQuantityPerRound: number;
  canParticipate: boolean;
}

export default function SaleInfoPrice(props: SaleInfoPriceProps) {
  return <>{renderPriceSection({ ...props })}</>;
}

function renderPriceSection({
  auctionStatus,
  serverTime,
  auctionOpenAt,
  auctionCloseAt,
  remainingUntilOpenSeconds,
  remainingUntilCloseSeconds,
  startPrice,
  minimumPrice,
  currentPrice,
  nextPrice,
  discountAmount,
  priceDropUnit,
  priceDropIntervalSeconds,
  secondsUntilNextDrop,
  maxPurchaseQuantityPerRound,
  canParticipate,
}: SaleInfoPriceProps) {
  console.log(secondsUntilNextDrop, 'secondsUntilNextDrop');
  switch (auctionStatus) {
    case 'SCHEDULED':
      return (
        <>
          <div className="priceInfoBefore">
            <Typography
              variant="label-2"
              className="text-[var(--content-extra-low)]"
            >
              시작 가격
            </Typography>
            <Typography
              variant="heading-1"
              className="text-[var(--content-high)]"
              weight="bold"
            >
              {formatWon(startPrice)}
            </Typography>
          </div>
          <div className="py-ms">
            <div className="w-full h-[1px] bg-[var(--line-3)]" />
          </div>
        </>
      );

    case 'OPEN':
      return (
        <div className="priceInfoAfter">
          <div className="flex items-center gap-2xs">
            <Icon name="Ticket" size={24}></Icon>
            <Typography variant="label-1" weight="bold">
              한 회차당 {maxPurchaseQuantityPerRound}장
            </Typography>
            <Icon
              className="text-[var(--content-extra-low)]"
              name="Info"
              size={24}
            ></Icon>
          </div>
          <div className="py-[16px]">
            <Typography
              variant="label-2"
              className="text-[var(--content-extra-low)]"
            >
              시작 가격 {formatWon(startPrice)}
            </Typography>
            <div className="flex items-center gap-2xs">
              <Typography
                variant="heading-1"
                className="text-[var(--content-high)]"
                weight="bold"
              >
                {formatWon(currentPrice as number)}
              </Typography>
              <div className="flex items-center text-[var(--status-warning)]">
                <Icon size={32} name="CaretDown"></Icon>
                <Typography variant="label-2" weight="bold">
                  {formatWon(startPrice - (currentPrice as number))}총 할인중
                </Typography>
              </div>
            </div>
          </div>
          <Button
            size="large"
            disabled
            className="w-full disabled:bg-[var(--component-default)] "
          >
            <div className="w-full flex items-center justify-between p-ms">
              <Typography
                variant="label-3"
                weight="regular"
                className="text-[var(--content-extra-low)]"
              >
                다음 가격 하락까지
              </Typography>
              <Typography
                variant="label-1"
                weight="bold"
                className="text-black"
              >
                {formatSecondsToMMSS(secondsUntilNextDrop)}
              </Typography>
            </div>
          </Button>
          <div className="py-ms">
            <div className="w-full h-[1px] bg-[var(--line-3)]" />
          </div>
        </div>
      );

    case 'SOLD_OUT':
      return null;

    case 'CLOSED':
      return null;

    default:
      return null;
  }
}
