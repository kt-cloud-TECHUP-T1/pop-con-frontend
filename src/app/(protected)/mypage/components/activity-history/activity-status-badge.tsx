import { Tag } from '@/components/ui/tag';
import { cn } from '@/lib/utils';
import type { ActivityStatusTone } from '@/features/mypage/types/activity';

type ActivityStatusBadgeProps = {
  label: string;
  tone: ActivityStatusTone;
  className?: string;
};

const toneToTagColor: Record<ActivityStatusTone, 'blue' | 'orange' | 'red' | 'green'> = {
  neutral: 'blue',
  warning: 'orange',
  danger: 'red',
  success: 'green',
};

export function ActivityStatusBadge({
  label,
  tone,
  className,
}: ActivityStatusBadgeProps) {
  return (
    <Tag
      label={label}
      tone="secondary"
      color={toneToTagColor[tone]}
      size="medium"
      className={cn('inline-flex whitespace-nowrap', className)}
    />
  );
}
