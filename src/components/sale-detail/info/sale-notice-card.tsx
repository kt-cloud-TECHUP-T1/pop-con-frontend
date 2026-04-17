import { Box } from '@/components/ui/box';
import { Typography } from '@/components/ui/typography';
import { ReactNode } from 'react';

interface NoticeCardProps {
  title?: string;
  items: string[];
  slot?: ReactNode;
}

export default function SaleNoticeCard({
  title = '안내사항',
  items,
  slot,
}: NoticeCardProps) {
  return (
    <Box
      as="section"
      radius="ML"
      border="var(--line-3)"
      background="var(--component-default)"
      padding="MS"
      className="w-full"
    >
      <header>
        <Typography
          variant="body-1"
          weight="medium"
          className="text-[var(--content-high)]"
        >
          {title}
        </Typography>
      </header>
      <ul className="mt-xs flex flex-col gap-2xs text-[var(--content-medium)]">
        {items.map((item, idx) => (
          <li key={idx} className="flex gap-xs">
            <span className="mt-xs size-2xs rounded-full bg-[var(--content-low)]" />
            <Typography variant="label-2" weight="regular">
              {item}
            </Typography>
          </li>
        ))}
      </ul>
    </Box>
  );
}
