import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none ',
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
        ghost:
          'bg-transparent text-[var(--content-high)] hover:bg-[var(--ghost-btn-primary-hover)] active:bg-[var(--ghost-btn-primary-pressed)] disabled:text-[var(--content-disabled)]',
      },
      // 사이즈에 관한건 아직 맵핑된 inline 사이즈 사용전
      size: {
        large:
          'h-12 min-w-[88px] px-3 py-2  gap-xs  text-base rounded-[var(--radius-ms)]',
        medium:
          'h-10 min-w-[72px] px-2.5 py-2  gap-xs text-sm rounded-[var(--radius-s)]',
        small:
          'h-9 min-w-[68px] px-2.5 py-2  gap-2xs text-sm rounded-[var(--radius-ms)]',
        xsmall:
          'h-7 min-w-[50px] px-2 py-1  gap-2xs  text-xs rounded-[var(--radius-xs)]',
      },
    },

    defaultVariants: {
      variant: 'primary',
      size: 'medium',
    },
  }
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
