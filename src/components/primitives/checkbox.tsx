// components/ui/checkbox.tsx
import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Icon } from '../Icon/Icon';

const checkboxVariants = cva(
  'peer shrink-0 rounded border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
      },
      error: {
        true: 'border-red-500 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500',
        false:
          'border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary',
      },
    },
    defaultVariants: {
      size: 'md',
      error: false,
    },
  }
);

export interface CheckboxProps
  extends
    Omit<
      React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
      'asChild'
    >,
    VariantProps<typeof checkboxVariants> {}

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ className, size, error, ...props }, ref) => (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(checkboxVariants({ size, error }), className)}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center ">
        <Icon name="SquareCheckboxFill" className="h-full w-full" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };
