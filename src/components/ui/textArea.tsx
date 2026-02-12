'use client';

import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { FieldWrapper, FieldState } from './fieldWrapper';

type TextAreaSize = 'large' | 'medium' | 'small' | 'xsmall';

interface TextAreaMessages {
  default?: string;
  error?: string;
  positive?: string;
  disabled?: string;
}

const textAreaVariants = cva(
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
    'resize-none', // 디자인 시스템 기준 고정 추천
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
      },
      textAreaSize: {
        large: 'min-h-32 p-[var(--spacing-s)] text-[var(--font-size-body-1)]',
        medium: 'min-h-28 p-[var(--spacing-s)] text-[var(--font-size-body-1)]',
        small: 'min-h-24 p-[var(--spacing-xs)] text-[var(--font-size-body-2)]',
        xsmall: 'min-h-20 p-[var(--spacing-xs)] text-[var(--font-size-body-2)]',
      },
    },
    defaultVariants: {
      state: 'default',
      textAreaSize: 'medium',
    },
  }
);

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  required?: boolean;
  state?: FieldState;
  messages?: TextAreaMessages;
  textAreaSize?: TextAreaSize;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      className,
      state = 'default',
      label,
      required,
      messages,
      textAreaSize = 'medium',
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <FieldWrapper
        label={label}
        required={required}
        state={state}
        disabled={disabled}
        messages={messages}
      >
        <textarea
          ref={ref}
          disabled={disabled}
          className={cn(textAreaVariants({ state, textAreaSize }), className)}
          {...props}
        />
      </FieldWrapper>
    );
  }
);

TextArea.displayName = 'TextArea';
