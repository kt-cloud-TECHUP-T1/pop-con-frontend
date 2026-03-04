'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Icon } from '@/components/Icon/Icon';
import { cn } from '@/lib/utils';

export type CheckboxVisualState = 'default' | 'hover' | 'pressed';

export interface CheckboxProps extends React.ComponentPropsWithoutRef<
  typeof CheckboxPrimitive.Root
> {
  isError?: boolean;
  visualState?: CheckboxVisualState;
  size?: number;
}

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(
  (
    { className, isError, visualState = 'default', size = 20, style, ...props },
    ref
  ) => {
    return (
      <CheckboxPrimitive.Root
        ref={ref}
        data-visual-state={visualState}
        aria-invalid={isError || props['aria-invalid'] ? true : undefined}
        style={{ width: size, height: size, ...style }}
        className={cn(
          'peer group relative inline-flex shrink-0 items-center justify-center rounded-md outline-none transition-transform',
          'focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2',
          isError && 'focus-visible:ring-destructive/50',
          'disabled:cursor-not-allowed',
          className
        )}
        {...props}
      >
        {/* 기본 */}
        <div className="group-data-[state=checked]:hidden flex items-center justify-center">
          <Icon
            name="SquareCheckbox"
            size={size}
            className={cn(
              'pointer-events-none transition-all duration-150',
              '[--checkbox-border-color:var(--line-4)]',
              'group-hover:[--checkbox-border-color:var(--content-high)]',
              'group-active:[--checkbox-border-color:var(--content-high)]',
              'group-data-[visual-state=hover]:[--checkbox-border-color:var(--content-high)]',
              'group-data-[visual-state=pressed]:[--checkbox-border-color:var(--content-high)]',
              'group-disabled:[--checkbox-border-color:var(--component-disabled)]',
              'group-hover:opacity-85 group-active:opacity-75 group-active:scale-95',
              'group-data-[visual-state=hover]:opacity-85',
              'group-data-[visual-state=pressed]:opacity-75 group-data-[visual-state=pressed]:scale-95',
              isError &&
                `[--checkbox-border-color:var(--status-warning)] 
                group-hover:[--checkbox-border-color:var(--status-warning)] 
                group-data-[visual-state=hover]:[--checkbox-border-color:var(--status-warning)] 
                group-data-[visual-state=pressed]:[--checkbox-border-color:var(--status-warning)] 
                group-hover:opacity-70 
                group-data-[visual-state=hover]:opacity-70`
            )}
          />
        </div>

        {/* 체크 */}
        <CheckboxPrimitive.Indicator className="flex items-center justify-center">
          <Icon
            name="SquareCheckboxFill"
            size={size}
            className={cn(
              'pointer-events-none transition-all duration-150',
              '[--checkbox-fill-bg:var(--content-high)]',
              'group-disabled:[--checkbox-fill-bg:var(--component-disabled)]',
              isError &&
                `[--checkbox-fill-bg:var(--status-warning)] 
                group-hover:[--checkbox-fill-bg:var(--status-warning)] 
                group-data-[visual-state=hover]:[--checkbox-fill-bg:var(--status-warning)] 
                group-data-[visual-state=pressed]:[--checkbox-fill-bg:var(--status-warning)]`,
              'group-hover:opacity-90 group-active:opacity-80 group-active:scale-95',
              'group-data-[visual-state=hover]:opacity-90',
              'group-data-[visual-state=pressed]:opacity-80 group-data-[visual-state=pressed]:scale-95'
            )}
          />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    );
  }
);

Checkbox.displayName = 'Checkbox';
