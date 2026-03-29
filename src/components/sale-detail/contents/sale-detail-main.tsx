// auction-detail-main.tsx
import SaleContent from '@/components/sale-detail/contents/sale-content';
import SaleHeader from '@/components/sale-detail/contents/sale-header';
import { SaleMap } from '@/components/sale-detail/contents/sale-map';
import SaleReview from '@/components/sale-detail/contents/sale-review';
import SaleTab from '@/components/sale-detail/contents/sale-tab';
import { SaleThumbnail } from '@/components/sale-detail/contents/sale-thumbnail';

export function SaleDetailMain({
  hasStickyTopBar,
}: {
  hasStickyTopBar: boolean;
}) {
  return (
    <div className="flex flex-col">
      <SaleThumbnail
        size="lg"
        src="/images/temp/no-image.png"
        alt="이미지 불러오기 실패"
      />
      <SaleHeader />
      <SaleTab hasStickyTopBar={hasStickyTopBar} />
      <SaleContent hasStickyTopBar={hasStickyTopBar} />
      <SaleMap />
      <SaleReview hasStickyTopBar={hasStickyTopBar} />
    </div>
  );
}
