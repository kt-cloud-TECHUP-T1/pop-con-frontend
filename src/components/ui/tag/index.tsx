import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { PADDING_X, PADDING_Y, RADIUS } from '@/constants/design-system';
import { Typography } from '../typography';

const tagVariants = cva(
  'inline-flex w-fit items-center justify-center whitespace-nowrap',
  {
    variants: {
      tone: {
        primary: '',
        secondary: '',
      },
      color: {
        gray: '',
        red: '',
        orange: '',
        blue: '',
        green: '',
      },
      size: {
        large: '',
        medium: '',
        small: '',
      },
    },
    compoundVariants: [
      {
        tone: 'primary',
        color: 'gray',
        className: 'bg-[var(--neutral-60)] text-[var(--white)]',
      },
      {
        tone: 'primary',
        color: 'red',
        className: 'bg-[var(--red-50)] text-[var(--white)]',
      },
      {
        tone: 'primary',
        color: 'orange',
        className: 'bg-[var(--orange-50)] text-[var(--white)]',
      },
      {
        tone: 'primary',
        color: 'blue',
        className: 'bg-[var(--blue-50)] text-[var(--white)]',
      },
      {
        tone: 'primary',
        color: 'green',
        className: 'bg-[var(--green-50)] text-[var(--white)]',
      },
      {
        tone: 'secondary',
        color: 'gray',
        className: 'bg-[var(--neutral-90)] text-[var(--neutral-50)]',
      },
      {
        tone: 'secondary',
        color: 'red',
        className: 'bg-[var(--red-95)] text-[var(--red-50)]',
      },
      {
        tone: 'secondary',
        color: 'orange',
        className: 'bg-[var(--orange-95)] text-[var(--orange-45)]',
      },
      {
        tone: 'secondary',
        color: 'blue',
        className: 'bg-[var(--blue-95)] text-[var(--blue-40)]',
      },
      {
        tone: 'secondary',
        color: 'green',
        className: 'bg-[var(--green-95)] text-[var(--green-40)]',
      },
    ],
    defaultVariants: {
      tone: 'primary',
      color: 'gray',
      size: 'medium',
    },
  }
);

const tagSizeClassNames = {
  large: cn(PADDING_Y._2XS, PADDING_X.MS),
  medium: cn(PADDING_Y._2XS, PADDING_X.XS),
  small: cn(PADDING_Y.NONE, PADDING_X.XS),
} as const;

const tagRadiusBySize = {
  large: RADIUS.S,
  medium: RADIUS.XS,
  small: RADIUS.XS,
} as const;

const tagTypographyBySize = {
  large: 'label-2',
  medium: 'label-3',
  small: 'caption-2',
} as const;

export interface TagProps
  extends
    Omit<React.HTMLAttributes<HTMLSpanElement>, 'children' | 'color'>,
    VariantProps<typeof tagVariants> {
  label: string;
}

export const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ className, tone, color, size, label, ...props }, ref) => {
    const resolvedSize = size ?? 'medium';

    return (
      <Typography
        variant={tagTypographyBySize[resolvedSize]}
        weight="medium"
        as="p"
        ref={ref}
        className={cn(
          tagRadiusBySize[resolvedSize],
          tagSizeClassNames[resolvedSize],
          tagVariants({ tone, color, size: resolvedSize }),
          className
        )}
        {...props}
      >
        {label}
      </Typography>
    );
  }
);

Tag.displayName = 'Tag';

export { tagVariants };
