import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

interface SaleContentProps {
  className?: string;
  description: string;
  hasStickyTopBar: boolean;
}

export default function SaleContent({
  className,
  description,
  hasStickyTopBar,
}: SaleContentProps) {
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
