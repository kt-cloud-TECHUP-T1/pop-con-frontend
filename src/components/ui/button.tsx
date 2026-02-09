// import * as React from "react"
// import { cva, type VariantProps } from "class-variance-authority"
// import { Slot } from "radix-ui"

// import { cn } from "@/lib/utils"

// const buttonVariants = cva(
//   "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
//   {
//     variants: {
//       variant: {
//         default: "bg-primary text-primary-foreground hover:bg-primary/90",
//         destructive:
//           "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
//         outline:
//           "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
//         secondary:
//           "bg-secondary text-secondary-foreground hover:bg-secondary/80",
//         ghost:
//           "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
//         link: "text-primary underline-offset-4 hover:underline",
//       },
//       size: {
//         default: "h-9 px-4 py-2 has-[>svg]:px-3",
//         xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
//         sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
//         lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
//         icon: "size-9",
//         "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
//         "icon-sm": "size-8",
//         "icon-lg": "size-10",
//       },
//     },
//     defaultVariants: {
//       variant: "default",
//       size: "default",
//     },
//   }
// )

// function Button({
//   className,
//   variant = "default",
//   size = "default",
//   asChild = false,
//   ...props
// }: React.ComponentProps<"button"> &
//   VariantProps<typeof buttonVariants> & {
//     asChild?: boolean
//   }) {
//   const Comp = asChild ? Slot.Root : "button"

//   return (
//     <Comp
//       data-slot="button"
//       data-variant={variant}
//       data-size={size}
//       className={cn(buttonVariants({ variant, size, className }))}
//       {...props}
//     />
//   )
// }

// export { Button, buttonVariants }

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-[var(--btn-primary-default)] text-white hover:bg-[var(--btn-primary-hover)] active:bg-[var(--btn-primary-pressed)] disabled:bg-[var(--btn-primary-disabled)]',
        secondary:
          'bg-[var(--btn-secondary-default)] text-[var(--content-high)] hover:bg-[var(--btn-secondary-hover)] active:bg-[var(--btn-secondary-pressed)] disabled:bg-[var(--btn-secondary-disabled)]',
        tertiary:
          'border border-[var(--line-4)] bg-white text-[var(--content-high)] hover:border-[var(--line-4)] active:border-[var(--line-4)] disabled:border-[var(--line-2)] disabled:text-[var(--content-disabled)]',
        destructive:
          'bg-[var(--btn-destructive-default)] text-white hover:bg-[var(--btn-destructive-hover)] active:bg-[var(--btn-destructive-pressed)] disabled:bg-[var(--btn-destructive-disabled)]',
        ghost:
          'bg-transparent text-[var(--content-high)] hover:bg-[var(--ghost-btn-primary-hover)] active:bg-[var(--ghost-btn-primary-pressed)] disabled:text-[var(--content-disabled)]',
      },
      // 사이즈에 관한건 아직 맵핑된 inline 사이즈 사용전
      size: {
        large: 'h-12 min-w-[88px] px-3 py-2 gap-2  text-base',
        medium: 'h-10 min-w-[72px] px-2.5 py-2 gap-2 text-sm',
        small: 'h-9 min-w-[68px] px-2.5 py-2 gap-1 text-sm',
        xsmall: 'h-7 min-w-[50px] px-2 py-1 gap-1  text-xs',
      },
      hasIcon: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        variant: 'primary',
        hasIcon: true,
        className: 'gap-2',
      },
      {
        variant: 'secondary',
        hasIcon: true,
        className: 'gap-2',
      },
      {
        size: 'xsmall',
        hasIcon: true,
        className: 'gap-1',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'medium',
      hasIcon: false,
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
    const hasIcon = Boolean(leftIcon || rightIcon);

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, hasIcon, className }))}
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
