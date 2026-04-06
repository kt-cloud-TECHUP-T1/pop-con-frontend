import { DrawInfoContent } from '@/constants/sale-detail';
import SaleNoticeCard from './sale-notice-card';
import SaleScheduleInfo from './sale-schedule-info';
import SaleInfoCTA from './sale-info-cta';

export default function SaleDrawDetailSidebar() {
  return (
    <div className="flex flex-col gap-s">
      <div className="border border-[var(--line-3)] rounded-ml p-ms">
        <SaleScheduleInfo />
        <SaleInfoCTA></SaleInfoCTA>
      </div>
      <SaleNoticeCard items={DrawInfoContent} />
    </div>
  );
}
