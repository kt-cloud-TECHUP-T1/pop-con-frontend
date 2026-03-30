import type { ReactNode } from 'react';
import { ThumbnailImage } from '@/components/content/thumbnail-image';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import type { ActivityItem } from '@/app/(protected)/mypage/types';

type ActivityHistoryListProps = {
  items: ActivityItem[];
  thumbnailUrl?: string;
  className?: string;
  paymentStatusLabel?: string;
  getPaymentStatusLabel?: (item: ActivityItem) => string;
  getPriceClassName?: (item: ActivityItem) => string | undefined;
  renderRightContent: (item: ActivityItem) => ReactNode;
};

export function ActivityHistoryList({
  items,
  thumbnailUrl,
  className,
  paymentStatusLabel,
  getPaymentStatusLabel,
  getPriceClassName,
  renderRightContent,
}: ActivityHistoryListProps) {
  return (
    <ul className="space-y-8">
      {items.map((item) => (
        <li key={item.id}>
          <article
            className={cn(
              'grid grid-cols-1 gap-4 py-2 md:grid-cols-[80px_minmax(0,1fr)_160px_140px_160px] md:items-center md:gap-6',
              className
            )}
          >
            <ThumbnailImage
              src={thumbnailUrl ?? '/images/temp/no-image.png'}
              width={80}
              height={104}
              radius="ML"
              border="#0A0A0A14"
            />
            <Typography variant="title-2" weight="medium">
              {item.title}
            </Typography>
            <Typography variant="title-2" weight="bold" className={cn(getPriceClassName?.(item))}>
              {item.price}
            </Typography>
            <div className="text-left md:text-center">
              <Typography variant="body-1" className="text-[var(--neutral-20)]">
                {item.paidAt}
              </Typography>
              <Typography variant="body-2">
                {getPaymentStatusLabel?.(item) ?? paymentStatusLabel ?? '결제 완료'}
              </Typography>
            </div>
            <div className="md:justify-self-end">
              {renderRightContent(item)}
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
