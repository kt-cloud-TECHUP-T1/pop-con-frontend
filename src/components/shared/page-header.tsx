import { Typography, type TypographyVariant } from '@/components/ui/typography';

type PageHeaderProps = {
  title: string;
  description?: string;
  titleVariant?: TypographyVariant;
  titleWeight?: 'regular' | 'medium' | 'bold';
};

export function PageHeader({
  title,
  description,
  titleVariant = 'heading-2',
  titleWeight = 'medium',
}: PageHeaderProps) {
  return (
    <header className="mb-8">
      <Typography variant={titleVariant} weight={titleWeight}>
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
