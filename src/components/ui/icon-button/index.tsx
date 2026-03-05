import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Icon, type IconName } from '@/components/Icon/Icon';

const iconButtonVariants = cva(
  'inline-flex items-center justify-center rounded-shape-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary:
          'bg-[var(--btn-primary-default)] text-white hover:bg-[var(--btn-primary-hover)] active:bg-[var(--btn-primary-pressed)] disabled:bg-[var(--btn-primary-disabled)] disabled:text-[var(--content-disabled)]',
        secondary:
          'bg-[var(--btn-secondary-default)] text-[var(--content-high)] hover:bg-[var(--btn-secondary-hover)] active:bg-[var(--btn-secondary-pressed)] disabled:bg-[var(--btn-secondary-disabled)] disabled:text-[var(--content-disabled)]',
        tertiary:
          'border border-[var(--line-4)] bg-white text-[var(--content-high)] hover:bg-[var(--btn-tertiary-hover)] hover:border-[var(--line-4)] active:bg-[var(--btn-tertiary-pressed)] active:border-[var(--line-4)] disabled:border-[var(--line-3)] disabled:text-[var(--content-disabled)]',
        destructive:
          'bg-[var(--btn-destructive-default)] text-white hover:bg-[var(--btn-destructive-hover)] active:bg-[var(--btn-destructive-pressed)] disabled:bg-[var(--btn-destructive-disabled)]',
      },
      size: {
        large: 'h-12 w-12 p-[var(--spacing-xs)] gap-[var(--spacing-xs)]',
        medium: 'h-10 w-10 p-[var(--spacing-xs)] gap-[var(--spacing-xs)] ',
        small: 'h-8 w-8 p-[var(--spacing-2xs)] gap-[var(--spacing-xs)]',
        xsmall: 'h-6 w-6 p-[var(--spacing-2xs)] gap-[var(--spacing-xs)]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'medium',
    },
  }
);

export interface IconButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  icon: IconName;
  iconSize?: number;
  asChild?: boolean;
  ariaLabel: string; // 🔥 필수
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      variant,
      size,
      icon,
      iconSize,
      asChild = false,
      ariaLabel,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        ref={ref}
        aria-label={ariaLabel}
        className={cn(iconButtonVariants({ variant, size, className }))}
        {...props}
      >
        <Icon name={icon} size={iconSize} className="shrink-0" />
      </Comp>
    );
  }
);

IconButton.displayName = 'IconButton';
