// auction-detail-main.tsx
import SaleContent from '@/components/sale-detail/contents/sale-content';
import SaleHeader from '@/components/sale-detail/contents/sale-header';
import { SaleMap } from '@/components/sale-detail/contents/sale-map';
import SaleReview from '@/components/sale-detail/contents/sale-review';
import SaleTab from '@/components/sale-detail/contents/sale-tab';
import { SaleThumbnail } from '@/components/sale-detail/contents/sale-thumbnail';

export interface SaleDetailMainProps {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  location: string;
  reviewCount: number;
  viewCount: number;
  likeCount: number;
}

export function SaleDetailMain({
  title,
  subtitle,
  description,
  image,
  location,
  reviewCount,
  viewCount,
  likeCount,
}: SaleDetailMainProps) {
  return (
    <div className="flex flex-col gap-ms">
      <SaleThumbnail size="lg" src="/images/temp/no-image.png" />
      <SaleHeader
        subTitle={subtitle}
        title={title}
        viewCount={viewCount}
        likeCount={likeCount}
      />
      <SaleTab reviewCount={reviewCount} />
      <SaleContent />
      <SaleMap location={location} />
      <SaleReview />
    </div>
  );
}
