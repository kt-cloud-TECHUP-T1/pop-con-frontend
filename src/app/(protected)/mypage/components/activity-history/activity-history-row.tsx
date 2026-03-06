import { ThumbnailImage } from '@/components/content/thumbnail-image';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type ActivityHistoryRowProps = {
  title: string;
  price: string;
  paidAt: string;
  paymentStatusLabel?: string;
  thumbnailUrl?: string;
  rightContent?: ReactNode;
  priceClassName?: string;
  className?: string;
};

export function ActivityHistoryRow({
  title,
  price,
  paidAt,
  paymentStatusLabel = '결제 완료',
  thumbnailUrl = '/images/temp/no-image.png',
  rightContent,
  priceClassName,
  className,
}: ActivityHistoryRowProps) {
  return (
    <article
      className={cn(
        'grid grid-cols-1 gap-4 py-2 md:grid-cols-[80px_minmax(0,1fr)_160px_112px_96px] md:items-center md:gap-6',
        className
      )}
    >
      <ThumbnailImage
        src={thumbnailUrl}
        width={80}
        height={104}
        radius="ML"
        border="#0A0A0A14"
      />

      <Typography variant="title-2" weight="medium">
        {title}
      </Typography>

      <Typography
        variant="title-2"
        weight="bold"
        className={cn(priceClassName)}
      >
        {price}
      </Typography>

      <div className="text-left md:text-center">
        <Typography variant="body-1" className="text-[var(--neutral-20)]">
          {paidAt}
        </Typography>
        <Typography variant="body-2">{paymentStatusLabel}</Typography>
      </div>

      <div className="md:justify-self-end">{rightContent}</div>
    </article>
  );
}
