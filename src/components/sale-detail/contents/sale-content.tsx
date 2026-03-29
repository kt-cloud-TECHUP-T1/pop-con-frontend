import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import { usePopupStore } from '../stores/popup-store';

interface SaleContentProps {
  className?: string;

  hasStickyTopBar: boolean;
}

export default function SaleContent({
  className,
  hasStickyTopBar,
}: SaleContentProps) {
  const description = usePopupStore((state) => state.data?.description);

  return (
    <section
      id="content"
      className={cn(
        'w-full py-l',
        hasStickyTopBar ? 'scroll-mt-24' : 'scroll-mt-15',
        className
      )}
    >
      <div>
        <Typography variant="title-1" weight="bold">
          소개
        </Typography>
      </div>
      <div>
        <Typography
          variant="body-1"
          weight="regular"
          className="whitespace-pre-line pt-ms"
        >
          {description}
        </Typography>
      </div>
    </section>
  );
}
