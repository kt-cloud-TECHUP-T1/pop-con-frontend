import { cn } from '@/lib/utils';

interface ProgressProps extends React.ComponentProps<'div'> {
  value: number;
  min?: number;
  max?: number;
  minVisualPercent?: number;
  trackClassName?: string;
  fillClassName?: string;
}

const clamp = (value: number, min: number, max: number) => {
  return Math.min(max, Math.max(min, value));
};

export const Progress = ({
  value,
  min = 0,
  max = 100,
  minVisualPercent = 0,
  className,
  trackClassName,
  fillClassName,
  ...props
}: ProgressProps) => {
  const safeMax = max <= min ? min + 1 : max;
  const safeValue = clamp(value, min, safeMax);
  const normalized = ((safeValue - min) / (safeMax - min)) * 100;
  const visualPercent = clamp(normalized, minVisualPercent, 100);

  return (
    <div
      role="progressbar"
      aria-valuemin={min}
      aria-valuemax={safeMax}
      aria-valuenow={Math.round(safeValue)}
      className={cn(
        'h-3 w-full rounded-full bg-[#0A0A0A0A]',
        trackClassName,
        className
      )}
      {...props}
    >
      <div
        className={cn(
          'h-full rounded-full bg-[var(--btn-primary-default)] transition-all duration-500',
          fillClassName
        )}
        style={{ width: `${visualPercent}%` }}
      />
    </div>
  );
};
