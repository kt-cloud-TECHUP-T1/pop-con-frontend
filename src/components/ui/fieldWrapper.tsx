'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export type FieldState = 'default' | 'error' | 'positive';

interface FieldMessages {
  default?: string;
  error?: string;
  positive?: string;
  disabled?: string;
}

interface FieldWrapperProps {
  label?: string;
  required?: boolean;
  state?: FieldState;
  disabled?: boolean;
  messages?: FieldMessages;
  children: React.ReactNode;
}

export function FieldWrapper({
  label,
  required,
  state = 'default',
  disabled,
  messages,
  children,
}: FieldWrapperProps) {
  const isDisabled = !!disabled;

  const resolvedMessage = isDisabled
    ? messages?.disabled
    : state === 'error'
      ? messages?.error
      : state === 'positive'
        ? messages?.positive
        : messages?.default;

  const messageColor = isDisabled
    ? 'text-[var(--content-disabled)]'
    : state === 'error'
      ? 'text-[var(--status-warning)]'
      : state === 'positive'
        ? 'text-[var(--status-positive)]'
        : 'text-[var(--content-extra-low)]';

  return (
    <div className="flex flex-col gap-[var(--spacing-2xs)] w-full">
      {label && (
        <label className="text-[var(--font-size-label-2)] text-[var(--content-high)]">
          {label}
          {required && (
            <span className="ml-1 text-[var(--status-warning)]">*</span>
          )}
        </label>
      )}

      {children}

      {resolvedMessage && (
        <span className={cn('text-[var(--font-size-caption-1)]', messageColor)}>
          {resolvedMessage}
        </span>
      )}
    </div>
  );
}
