import { Icon } from '@/components/Icon/Icon';
import { Typography } from '@/components/ui/typography';

interface SaleHeaderProps {
  title: string;
  subTitle?: string;
  viewCount?: number;
  likeCount?: number;
  className?: string;
}

export default function SaleHeader({
  title,
  subTitle,
  viewCount = 0,
  likeCount = 0,
  className,
}: SaleHeaderProps) {
  return (
    <div className="py-m">
      <section className="flex justify-between">
        <Typography
          variant="title-2"
          weight="medium"
          className="text-[var(--content-extra-low)]"
        >
          {subTitle}
        </Typography>
        <div className="flex gap-xs text-[var(--content-extra-low)]">
          <Icon name="Heart" size={24}></Icon>
          <Icon name="Share1" size={24}></Icon>
        </div>
      </section>
      <section>
        <Typography variant="heading-1" weight="bold">
          {title}
        </Typography>
      </section>
      <section className="flex gap-xs pt-2xs text-[var(--content-extra-low)]">
        <div className="flex items-center gap-2xs ">
          <Icon name="Heart" size={20}></Icon>
          <div>{viewCount}</div>
        </div>
        <div className="flex items-center gap-2xs">
          <Icon name="Eyes" size={20}></Icon>
          <div>{viewCount}</div>
        </div>
      </section>
    </div>
  );
}
