import { DrawInfoContent } from '@/constants/sale-detail';
import SaleNoticeCard from './sale-notice-card';
import SaleScheduleInfo from './sale-schedule-info';
import SaleInfoCTA from './sale-info-cta';
import { Box } from '@/components/ui/box';

export default function SaleDrawDetailSidebar() {
  return (
    <div className="flex flex-col gap-s">
      <Box border="var(--line-3)" radius="ML" padding="MS">
        <SaleScheduleInfo />
        <SaleInfoCTA></SaleInfoCTA>
      </Box>
      <SaleNoticeCard items={DrawInfoContent} />
    </div>
  );
}
