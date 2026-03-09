import { Typography, type TypographyVariant } from '@/components/ui/typography';

type MyPageHeaderProps = {
  title: string;
  description?: string;
  titleVariant?: TypographyVariant;
  titleWeight?: 'regular' | 'medium' | 'bold';
};

export function MyPageHeader({
  title,
  description,
  titleVariant = 'heading-2',
  titleWeight = 'medium',
}: MyPageHeaderProps) {
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
