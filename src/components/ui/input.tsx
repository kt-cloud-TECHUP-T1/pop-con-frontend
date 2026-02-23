'use client';

import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { FieldWrapper, FieldState } from './field-wrapper';

type InputSize = 'large' | 'medium' | 'small' | 'xsmall';

interface InputMessages {
  default?: string;
  error?: string;
  positive?: string;
  disabled?: string;
  expire?: string;
}

const inputVariants = cva(
  [
    'w-full',
    'rounded-[var(--radius-s)]',
    'bg-[var(--bg-default)]',
    'border',
    'transition-colors',
    'outline-none',
    'placeholder:text-[var(--content-placeholder)]',
    'disabled:bg-[var(--component-disabled)]',
    'disabled:cursor-not-allowed',
  ].join(' '),
  {
    variants: {
      state: {
        default:
          'border-[var(--line-3)] focus-visible:border-[var(--color-ring)]',
        error:
          'border-[var(--status-warning)] focus-visible:border-[var(--status-warning)]',
        positive:
          'border-[var(--line-3)] focus-visible:border-[var(--color-ring)]',
        expire:
          'border-[var(--status-warning)] focus-visible:border-[var(--status-warning)]',
      },
      inputSize: {
        large: 'h-14 px-[var(--spacing-s)] text-[var(--font-size-body-1)]',
        medium: 'h-12 px-[var(--spacing-s)] text-[var(--font-size-body-1)]',
        small: 'h-10 px-[var(--spacing-xs)] text-[var(--font-size-body-2)]',
        xsmall: 'h-8 px-[var(--spacing-xs)] text-[var(--font-size-body-2)]',
      },
      hasSuffix: {
        true: 'pr-16', // suffix 공간 확보
        false: '',
      },
    },
    defaultVariants: {
      state: 'default',
      inputSize: 'medium',
      hasSuffix: false,
    },
  }
);

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  required?: boolean;
  state?: FieldState;
  messages?: InputMessages;
  inputSize?: InputSize;
  suffix?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      state = 'default',
      label,
      required,
      messages,
      inputSize = 'medium',
      disabled,
      suffix,
      ...props
    },
    ref
  ) => {
    const hasSuffix = !!suffix;

    return (
      <FieldWrapper
        label={label}
        required={required}
        state={state}
        disabled={disabled}
        messages={messages}
      >
        <div className="relative w-full">
          <input
            ref={ref}
            disabled={disabled}
            className={cn(
              inputVariants({
                state,
                inputSize,
                hasSuffix,
              }),
              className
            )}
            {...props}
          />

          {suffix && (
            <div
              className="
                  pointer-events-none
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-[var(--content-medium)]
                  text-[var(--font-size-body-2)]
                  font-[var(--font-weight-bold)]
                "
            >
              {suffix}
            </div>
          )}
        </div>
      </FieldWrapper>
    );
  }
);

Input.displayName = 'Input';
