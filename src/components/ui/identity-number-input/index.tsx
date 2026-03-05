'use client';

import { Input } from '@/components/ui/input';
import { FieldWrapper } from '@/components/ui/field-wrapper';
import { cn } from '@/lib/utils';
import { FieldMessages } from '@/components/ui/field-wrapper';
import { useEffect, useRef, useState } from 'react';

type IdentityNumberInputProps = {
  label?: string;
  required?: boolean;
  state?: 'default' | 'error' | 'positive' | 'expire';
  messages?: FieldMessages;
  disabled?: boolean;
  onComplete?: (value: string) => void;
};

export function IdentityNumberInput({
  label,
  required,
  state,
  messages,
  disabled,
  onComplete,
}: IdentityNumberInputProps) {
  const [front, setFront] = useState('');
  const [middle, setMiddle] = useState('');
  const [back, setBack] = useState('');

  // 포커스 이동 시점의 최신 값을 확인하기 위한 ref
  const frontVal = useRef('');
  const middleVal = useRef('');
  const backVal = useRef('');

  const frontRef = useRef<HTMLInputElement>(null);
  const middleRef = useRef<HTMLInputElement>(null);
  const backRef = useRef<HTMLInputElement>(null);

  const onlyNumber = (v: string) => v.replace(/\D/g, '');

  // 앞 6자리
  const handleFrontChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nums = onlyNumber(e.target.value).slice(0, 6);
    setFront(nums);
    frontVal.current = nums;

    if (nums.length === 6) {
      middleRef.current?.focus();
    }
  };

  // 뒷 첫 자리
  const handleMiddleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nums = onlyNumber(e.target.value).slice(0, 1);
    setMiddle(nums);
    middleVal.current = nums;

    if (nums.length === 1) {
      backRef.current?.focus();
    }
  };

  // 뒷 6자리
  const handleBackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nums = onlyNumber(e.target.value).slice(0, 6);
    setBack(nums);
    backVal.current = nums;
  };

  // 백스페이스 이동
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    type: 'front' | 'middle' | 'back'
  ) => {
    if (e.key !== 'Backspace') return;

    if (type === 'middle' && !middle) {
      frontRef.current?.focus();
    }

    if (type === 'back' && !back) {
      middleRef.current?.focus();
    }
  };

  // 포커스 제어 (순차 입력 및 삭제 강제)
  const handleFocus = (field: 'front' | 'middle' | 'back') => {
    if (field === 'front') {
      if (middleVal.current.length > 0) {
        if (backVal.current.length > 0) {
          backRef.current?.focus();
        } else {
          middleRef.current?.focus();
        }
      }
    } else if (field === 'middle') {
      if (frontVal.current.length < 6) {
        frontRef.current?.focus();
      } else if (backVal.current.length > 0) {
        backRef.current?.focus();
      }
    } else if (field === 'back') {
      if (frontVal.current.length < 6) {
        frontRef.current?.focus();
      } else if (middleVal.current.length < 1) {
        middleRef.current?.focus();
      }
    }
  };

  // 전체 값 완성 시 콜백
  useEffect(() => {
    if (front.length === 6 && middle.length === 1 && back.length === 6) {
      onComplete?.(front + middle + back);
    }
  }, [front, middle, back, onComplete]);

  return (
    <FieldWrapper
      label={label}
      required={required}
      state={state}
      disabled={disabled}
      messages={messages}
    >
      <div className="flex items-center gap-[var(--spacing-2xs)] relative">
        {/* 앞 6자리 */}
        <div onClick={() => frontRef.current?.focus()}>
          <Input
            ref={frontRef}
            inputMode="numeric"
            maxLength={6}
            value={front}
            state={state}
            onChange={handleFrontChange}
            onKeyDown={(e) => handleKeyDown(e, 'front')}
            onFocus={() => handleFocus('front')}
            placeholder="●●●●●●"
            disabled={disabled}
            className="w-[141px] rounded-[var(--radius-ms)] text-left tracking-widest"
          />
        </div>

        <span>-</span>
        {/* 뒷 첫 자리 */}
        <div
          className="relative w-12"
          onClick={() => middleRef.current?.focus()}
        >
          <Input
            ref={middleRef}
            inputMode="numeric"
            maxLength={1}
            value={middle}
            state={state}
            onChange={handleMiddleChange}
            onKeyDown={(e) => handleKeyDown(e, 'middle')}
            onFocus={() => handleFocus('middle')}
            placeholder=""
            disabled={disabled}
            className="w-12 rounded-[var(--radius-ms)] text-transparent caret-black"
          />

          <div
            className={cn(
              'absolute inset-0',
              'flex items-center justify-center pointer-events-none '
            )}
          >
            {middle ? (
              <span className="text-black">{middle}</span>
            ) : (
              <span className="text-[var(--content-placeholder)]">●</span>
            )}
          </div>
        </div>

        {/* 뒤 6자리 UI (항상 진한 dot) */}
        <div
          className="flex items-center text-black text-[var(--font-size-label-1)] tracking-widest cursor-text"
          onClick={() => backRef.current?.focus()}
        >
          ●●●●●●
        </div>

        {/* 실제 뒤 6자리 input (숨김) */}
        <input
          ref={backRef}
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={back}
          onChange={handleBackChange}
          onKeyDown={(e) => handleKeyDown(e, 'back')}
          onFocus={() => handleFocus('back')}
          disabled={disabled}
          className="absolute opacity-0 pointer-events-none w-0 h-0"
        />
      </div>
    </FieldWrapper>
  );
}
