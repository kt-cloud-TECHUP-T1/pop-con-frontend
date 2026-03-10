'use client';

import { Box } from '@/components/ui/box';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

type ActivityStatusFilterOption<T extends string> = {
  value: T;
  label: string;
};

type ActivityStatusFiltersProps<T extends string> = {
  options: ActivityStatusFilterOption<T>[];
  activeValues: T[];
  onToggle: (value: T) => void;
};

export function ActivityStatusFilters<T extends string>({
  options,
  activeValues,
  onToggle,
}: ActivityStatusFiltersProps<T>) {
  return (
    <nav className="mb-8 flex flex-wrap gap-2" aria-label="상태 필터">
      {options.map((option) => {
        const isActive = activeValues.includes(option.value);

        return (
          <Box
            as="button"
            key={option.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onToggle(option.value)}
            radius="FULL"
            border={isActive ? 'var(--neutral-10)' : 'var(--neutral-80)'}
            paddingX="S"
            paddingY="XS"
            className={cn(
              'transition-colors',
              isActive
                ? 'bg-[var(--neutral-10)] text-white'
                : 'bg-white text-[var(--neutral-60)]'
            )}
          >
            <Typography variant="label-2" weight="bold" as="p">
              {option.label}
            </Typography>
          </Box>
        );
      })}
    </nav>
  );
}
