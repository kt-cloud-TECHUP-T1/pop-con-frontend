import { Icon } from '@/components/Icon/Icon';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import { SaleScheduleInfoProps } from '@/types/sale-detail';

export default function SaleScheduleInfo({
  phaseType,
  openAt,
  closeAt,
  weekdayOpen,
  weekdayClose,
  weekendOpen,
  weekendClose,
  location,
}: SaleScheduleInfoProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2xs pb-ms text-[var(--content-extra-low)]'
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
  );
}
