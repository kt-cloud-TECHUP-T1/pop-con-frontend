import { SaleDetailLayout } from '@/components/layout/sale-detail-layout';
import { Wrapper } from '@/components/layout/wrapper';
import { SaleDetailMain } from '@/components/sale-detail/contents/sale-detail-main';
import { SaleDetailSidebar } from '@/components/sale-detail/summary/sale-detail-sidebar';

export default function DrawPage() {
  return (
    <Wrapper className="py-[var(--spacing-l)]">
      <SaleDetailLayout
        left={<SaleDetailMain></SaleDetailMain>}
        right={<SaleDetailSidebar></SaleDetailSidebar>}
      />
    </Wrapper>
  );
}
