// "use client"

// import * as React from "react"
// import { CheckIcon } from "lucide-react"
// import { Checkbox as CheckboxPrimitive } from "radix-ui"

// import { cn } from "@/lib/utils"

// function Checkbox({
//   className,
//   ...props
// }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
//   return (
//     <CheckboxPrimitive.Root
//       data-slot="checkbox"
//       className={cn(
//         "peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
//         className
//       )}
//       {...props}
//     >
//       <CheckboxPrimitive.Indicator
//         data-slot="checkbox-indicator"
//         className="grid place-content-center text-current transition-none"
//       >
//         <CheckIcon className="size-3.5" />
//       </CheckboxPrimitive.Indicator>
//     </CheckboxPrimitive.Root>
//   )
// }

// export { Checkbox }

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
