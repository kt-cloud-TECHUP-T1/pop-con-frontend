'use client';
import { Icon } from '@/components/Icon/Icon';
import { Typography } from '@/components/ui/typography';
import { cn, formatTimeToHourMinute } from '@/lib/utils';
import { useParams } from 'next/navigation';
import { usePopupDetailQuery } from '../queries/use-popup-detail-query';

export default function SaleScheduleInfo() {
  const params = useParams<{ popupId: string }>();
  const popupIdNumber = Number(params.popupId);
  const { data: popupData } = usePopupDetailQuery(popupIdNumber);

  if (popupData == null) return;
  return (
    <div
      className={cn(
        'flex flex-col gap-xs pb-ms text-[var(--content-extra-low)]'
      )}
    >
      <div className="flex items-center gap-2xs">
        <Icon name="Pin" size={20}></Icon>
        <Typography variant="body-2">{popupData.location}</Typography>
      </div>
      <div className="flex items-center gap-2xs">
        <Icon name="Calender" size={20}></Icon>
        <Typography variant="body-2">
          {popupData.openAt.replaceAll('-', '.')} -{' '}
          {popupData.closeAt.replaceAll('-', '.')}
        </Typography>
      </div>
      <div className="flex items-center gap-2xs">
        <Icon name="Clock" size={20}></Icon>
        <Typography variant="body-2">
          평일 {formatTimeToHourMinute(popupData.weekdayOpen)} -{' '}
          {formatTimeToHourMinute(popupData.weekdayClose)} / 주말{' '}
          {formatTimeToHourMinute(popupData.weekendOpen)} -{' '}
          {formatTimeToHourMinute(popupData.weekendClose)}
        </Typography>
      </div>
    </div>
  );
}
