'use client';

import { forwardRef, useEffect, useState } from 'react';
import { Input, InputProps } from '@/components/ui/input';
import type { FieldState } from '@/components/ui/field-wrapper';

export interface VerificationInputProps extends Omit<InputProps, 'suffix'> {
  duration?: number; // 전체 제한 시간 (초)
  autoStart?: boolean; // 자동 시작 여부
  onExpire?: () => void; // 만료 시 콜백
  state?: FieldState; // 부모 제어 상태
}

export const VerificationInput = forwardRef<
  HTMLInputElement,
  VerificationInputProps
>(({ duration = 180, autoStart = true, onExpire, state, ...props }, ref) => {
  const [time, setTime] = useState(duration);

  /* =========================
       시간 포맷
    ========================= */
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  /* =========================
       타이머 동작
    ========================= */
  useEffect(() => {
    if (!autoStart) return;
    if (state === 'positive') return;
    if (time <= 0) {
      onExpire?.();
      return;
    }

    const timer = setInterval(() => {
      setTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [time, autoStart, state, onExpire]);

  /* =========================
       상태 결정
    ========================= */
  let derivedState: FieldState;

  if (time <= 0) {
    derivedState = 'expire';
  } else if (state) {
    derivedState = state;
  } else {
    derivedState = 'default';
  }

  return (
    <Input
      ref={ref}
      {...props}
      state={derivedState}
      suffix={<span className="font-semibold">{formatTime(time)}</span>}
    />
  );
});

VerificationInput.displayName = 'VerificationInput';
