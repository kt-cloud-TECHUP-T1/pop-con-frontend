'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export type FieldState = 'default' | 'error' | 'positive' | 'expire';

export interface FieldMessages {
  default?: string;
  error?: string;
  positive?: string;
  disabled?: string;
  expire?: string;
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

  let resolvedMessage: string | undefined;
  let messageColor: string;

  /* =========================
   resolvedMessage 결정
========================= */
  if (isDisabled) {
    resolvedMessage = messages?.disabled;
  } else if (state === 'expire') {
    resolvedMessage = messages?.expire;
  } else if (state === 'error') {
    resolvedMessage = messages?.error;
  } else if (state === 'positive') {
    resolvedMessage = messages?.positive;
  } else {
    resolvedMessage = messages?.default;
  }

  /* =========================
   messageColor 결정
========================= */
  if (isDisabled) {
    messageColor = 'text-[var(--content-disabled)]';
  } else if (state === 'error' || state === 'expire') {
    messageColor = 'text-[var(--status-warning)]';
  } else if (state === 'positive') {
    messageColor = 'text-[var(--status-positive)]';
  } else {
    messageColor = 'text-[var(--content-extra-low)]';
  }

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
