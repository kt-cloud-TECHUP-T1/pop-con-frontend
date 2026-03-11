import { Icon } from '@/components/Icon/Icon';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { cn, formatWon } from '@/lib/utils';

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
  serverNow: string;
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
  serverNow,
  priceCloseAt,
}: SaleInfoCardProps) {
  return (
    <div className="border border-[var(--line-3)] rounded-ml p-ms">
      {phaseType == 'AUCTION' && (
        <div className="priceInfo flex flex-col pb-ms border-b border-[var(--line-3)]">
          <div className="flex items-center gap-2xs">
            <Icon name="Ticket" size={24}></Icon>
            <Typography variant="label-1" weight="bold">
              한 회차당 {extraTicket}장
            </Typography>
            <Icon
              className="text-[var(--content-extra-low)]"
              name="Info"
              size={24}
            ></Icon>
          </div>
          <div
            className={cn(
              phaseStatus === 'OPEN' && phaseType === 'AUCTION' && 'py-[16px]'
            )}
          >
            <Typography
              variant="label-2"
              className="text-[var(--content-extra-low)]"
            >
              시작 가격 {phaseStatus === 'OPEN' && formatWon(startPrice)}
            </Typography>
            <div className="flex items-center gap-2xs">
              <Typography
                variant="heading-1"
                className="text-[var(--content-high)]"
                weight="bold"
              >
                {phaseStatus == 'OPEN'
                  ? formatWon(currentPrice)
                  : formatWon(startPrice)}
              </Typography>
              <div className="flex items-center text-[var(--status-warning)]">
                <Icon size={32} name="CaretDown"></Icon>
                <Typography variant="label-2" weight="bold">
                  총 {formatWon(startPrice - currentPrice)}원 할인중
                </Typography>
              </div>
            </div>
          </div>
          {phaseStatus == 'OPEN' && (
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
          )}
        </div>
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
