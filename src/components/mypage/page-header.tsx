import { Typography, type TypographyVariant } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

type MyPagePageHeaderProps = {
  title: string;
  description?: string;
  titleVariant?: TypographyVariant;
  className?: string;
};

export function MyPagePageHeader({
  title,
  description,
  titleVariant = 'heading-2',
  className,
}: MyPagePageHeaderProps) {
  return (
    <header className={cn('mb-6', className)}>
      <Typography variant={titleVariant} weight="medium">
        {title}
      </Typography>
      {description ? (
        <Typography variant="body-1" className="mt-2 text-[var(--neutral-60)]">
          {description}
        </Typography>
      ) : null}
    </header>
  );
}
