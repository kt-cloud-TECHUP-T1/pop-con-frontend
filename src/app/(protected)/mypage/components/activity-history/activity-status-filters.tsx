'use client';

import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

type ActivityStatusFilterOption<T extends string> = {
  value: T;
  label: string;
};

type ActivityStatusFiltersProps<T extends string> = {
  options: ActivityStatusFilterOption<T>[];
  activeValue: T;
  onChange: (value: T) => void;
};

export function ActivityStatusFilters<T extends string>({
  options,
  activeValue,
  onChange,
}: ActivityStatusFiltersProps<T>) {
  return (
    <nav className="mb-8 flex flex-wrap gap-2" aria-label="상태 필터">
      {options.map((option) => {
        const isActive = option.value === activeValue;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              'rounded-full border px-4 py-2 transition-colors',
              isActive
                ? 'border-[var(--neutral-10)] bg-[var(--neutral-10)] text-white'
                : 'border-[var(--neutral-80)] bg-white text-[var(--neutral-60)]'
            )}
          >
            <Typography variant="label-2" weight="medium">
              {option.label}
            </Typography>
          </button>
        );
      })}
    </nav>
  );
}
