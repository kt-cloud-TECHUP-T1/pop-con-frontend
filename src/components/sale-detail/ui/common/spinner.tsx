import { cn } from '@/lib/utils';

type SpinnerSize = 's' | 'm' | 'l' | 'xl';
type SpinnerThickness = 's' | 'm' | 'l' | 'xl';

interface SpinnerProps {
  size?: SpinnerSize;
  thickness?: SpinnerThickness;
  colorClass?: string;
  className?: string;
}

// 크기만 담당
const sizeMap: Record<SpinnerSize, string> = {
  s: 'w-4 h-4',
  m: 'w-6 h-6',
  l: 'w-8 h-8',
  xl: 'w-12 h-12',
};

// 두께만 담당
const thicknessMap: Record<SpinnerThickness, string> = {
  s: 'border',
  m: 'border-2',
  l: 'border-4',
  xl: 'border-6',
};

export function Spinner({
  size = 'm',
  thickness = 'm',
  colorClass = 'border-t-[var(--orange-50)]',
  className,
}: SpinnerProps) {
  return (
    <div
      className={cn(
        'rounded-full border-gray-200 animate-spin',
        sizeMap[size],
        thicknessMap[thickness],
        colorClass,
        className
      )}
    />
  );
}
