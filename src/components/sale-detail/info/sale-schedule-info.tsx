import { Icon } from '@/components/Icon/Icon';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
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
        'flex flex-col gap-2xs pb-ms text-[var(--content-extra-low)]'
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
          평일 {popupData.weekdayOpen} - {popupData.weekdayClose} / 주말{' '}
          {popupData.weekendOpen} - {popupData.weekendClose}
        </Typography>
      </div>
    </div>
  );
}
