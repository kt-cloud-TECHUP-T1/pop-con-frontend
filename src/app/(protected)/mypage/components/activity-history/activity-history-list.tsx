import type { ReactNode } from 'react';
import { ThumbnailImage } from '@/components/content/thumbnail-image';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

type ActivityHistoryListProps<TItem extends { id: number }> = {
  items: TItem[];
  getTitle: (item: TItem) => string;
  getPrice: (item: TItem) => string;
  getPaidAt: (item: TItem) => string;
  getPaymentStatusLabel?: (item: TItem) => string;
  getThumbnailUrl?: (item: TItem) => string;
  getPriceClassName?: (item: TItem) => string | undefined;
  getClassName?: (item: TItem) => string | undefined;
  renderRightContent: (item: TItem) => ReactNode;
};

export function ActivityHistoryList<TItem extends { id: number }>({
  items,
  getTitle,
  getPrice,
  getPaidAt,
  getPaymentStatusLabel,
  getThumbnailUrl,
  getPriceClassName,
  getClassName,
  renderRightContent,
}: ActivityHistoryListProps<TItem>) {
  return (
    <ul className="space-y-8">
      {items.map((item) => (
        <li key={item.id}>
          <article
            className={cn(
              'grid grid-cols-1 gap-4 py-2 md:grid-cols-[80px_minmax(0,1fr)_160px_140px_160px] md:items-center md:gap-6',
              getClassName?.(item)
            )}
          >
            <ThumbnailImage
              src={getThumbnailUrl?.(item) ?? '/images/temp/no-image.png'}
              width={80}
              height={104}
              radius="ML"
              border="#0A0A0A14"
            />
            <Typography variant="title-2" weight="medium">
              {getTitle(item)}
            </Typography>
            <Typography
              variant="title-2"
              weight="bold"
              className={cn(getPriceClassName?.(item))}
            >
              {getPrice(item)}
            </Typography>
            <div className="text-left md:text-center">
              <Typography variant="body-1" className="text-[var(--neutral-20)]">
                {getPaidAt(item)}
              </Typography>
              <Typography variant="body-2">
                {getPaymentStatusLabel?.(item) ?? '결제 완료'}
              </Typography>
            </div>
            <div className="md:justify-self-end">{renderRightContent(item)}</div>
          </article>
        </li>
      ))}
    </ul>
  );
}
