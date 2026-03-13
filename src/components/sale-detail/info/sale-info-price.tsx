import { Icon } from '@/components/Icon/Icon';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { formatWon } from '@/lib/utils';

interface SaleInfoPriceProps {
  startPrice: number;
  phaseStatus: string;
}

const mockData = {
  auctionId: 1,
  auctionStatus: 'OPEN',
  startPrice: 100000,
  minimumPrice: 30000,
  currentPrice: 96000,
  nextPrice: 95000,
  priceDropUnit: 1000,
  priceDropIntervalSeconds: 10,
  secondsUntilNextDrop: 4,
  openedAt: '2026-03-11T14:48:13',
  closedAt: '2026-03-11T14:58:53',
  serverTime: '2026-03-11T14:49:15',
};

export default function SaleInfoPrice({
  startPrice,
  phaseStatus,
}: SaleInfoPriceProps) {
  return (
    <div className="priceInfo flex flex-col pb-ms border-b border-[var(--line-3)]">
      {phaseStatus == 'UPCOMING' ? (
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
      ) : (
        <div className="priceInfoAfter">
          <div className="flex items-center gap-2xs">
            <Icon name="Ticket" size={24}></Icon>
            <Typography variant="label-1" weight="bold">
              한 회차당 N장
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
              시작 가격 {formatWon(mockData.startPrice)}
            </Typography>
            <div className="flex items-center gap-2xs">
              <Typography
                variant="heading-1"
                className="text-[var(--content-high)]"
                weight="bold"
              >
                {formatWon(mockData.currentPrice)}
              </Typography>
              <div className="flex items-center text-[var(--status-warning)]">
                <Icon size={32} name="CaretDown"></Icon>
                <Typography variant="label-2" weight="bold">
                  총 {formatWon(mockData.startPrice - mockData.currentPrice)}원
                  할인중
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
                02:00
              </Typography>
            </div>
          </Button>
        </div>
      )}
    </div>
  );
}
