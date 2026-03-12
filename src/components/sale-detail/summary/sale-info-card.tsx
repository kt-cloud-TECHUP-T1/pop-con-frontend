import { Icon } from '@/components/Icon/Icon';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { cn, formatWon } from '@/lib/utils';
import SaleInfoPrice from './sale-info-price';

interface SaleInfoCardProps {
  phaseType: string;
  phaseStatus: string;
  openAt: string;
  closeAt: string;
  weekdayOpen: string;
  weekdayClose: string;
  weekendOpen: string;
  weekendClose: string;
  location: string;
  startPrice: number;
  currentPrice: number;
  extraTicket: number;
  serverTime: string;
  priceCloseAt: string;
}

export default function SaleInfoCard({
  phaseType,
  phaseStatus,
  openAt,
  closeAt,
  weekdayOpen,
  weekdayClose,
  weekendOpen,
  weekendClose,
  location,
  startPrice,
  currentPrice,
  extraTicket,
  serverTime,
  priceCloseAt,
}: SaleInfoCardProps) {
  return (
    <div className="border border-[var(--line-3)] rounded-ml p-ms">
      {phaseType === 'AUCTION' && (
        <SaleInfoPrice
          startPrice={startPrice}
          phaseStatus={phaseStatus}
        ></SaleInfoPrice>
      )}

      <div
        className={cn(
          'flex flex-col gap-2xs text-[var(--content-extra-low)]',
          phaseType === 'AUCTION' ? 'py-ms' : 'pb-ms'
        )}
      >
        <div className="flex items-center gap-2xs">
          <Icon name="Pin" size={20}></Icon>
          <Typography variant="body-2">{location}</Typography>
        </div>
        <div className="flex items-center gap-2xs">
          <Icon name="Calender" size={20}></Icon>
          <Typography variant="body-2">
            {openAt.replaceAll('-', '.')} - {closeAt.replaceAll('-', '.')}
          </Typography>
        </div>
        <div className="flex items-center gap-2xs">
          <Icon name="Clock" size={20}></Icon>
          <Typography variant="body-2">
            평일 {weekdayOpen} - {weekdayClose} / 주말 {weekendOpen} -{' '}
            {weekendClose}
          </Typography>
        </div>
      </div>
      {phaseStatus == 'OPEN' ? (
        <Button size="large" className="w-full">
          <Typography variant="label-1">
            {phaseType == 'AUCTION' ? '프리미엄 경매' : '드로우'} 참여하기
          </Typography>
        </Button>
      ) : (
        <Button size="large" className="w-full" disabled>
          <Typography variant="label-1">
            26.02.09 (월) 10:00 {phaseType == 'AUCTION' ? '경매' : '드로우'}{' '}
            오픈
          </Typography>
        </Button>
      )}
    </div>
  );
}
