import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

interface SaleContentProps {
  className?: string;
  description: string;
}

export default function SaleContent({
  className,
  description,
}: SaleContentProps) {
  return (
    <section id="content" className={cn('w-full scroll-mt-24 py-l', className)}>
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
