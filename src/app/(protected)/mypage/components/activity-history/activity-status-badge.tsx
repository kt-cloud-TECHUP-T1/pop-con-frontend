import { Box } from '@/components/ui/box';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import type { ActivityStatusTone } from '@/app/(protected)/mypage/components/activity-history/types';

const toneClassNames: Record<ActivityStatusTone, string> = {
  neutral: 'bg-[var(--blue-95)] text-[var(--blue-50)]',
  warning: 'bg-[var(--yellow-95)] text-[var(--yellow-50)]',
  danger: 'bg-[var(--red-95)] text-[var(--red-50)]',
  success: 'bg-[var(--green-95)] text-[var(--green-50)]',
};

type ActivityStatusBadgeProps = {
  label: string;
  tone: ActivityStatusTone;
  className?: string;
};

export function ActivityStatusBadge({
  label,
  tone,
  className,
}: ActivityStatusBadgeProps) {
  return (
    <Box
      as="span"
      radius="FULL"
      paddingY="_2XS"
      paddingX="S"
      className={cn(
        'inline-flex whitespace-nowrap',
        toneClassNames[tone],
        className
      )}
    >
      <Typography variant="label-3" weight="medium">
        {label}
      </Typography>
    </Box>
  );
}
