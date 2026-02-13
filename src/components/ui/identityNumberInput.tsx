'use client';

import * as React from 'react';
import { Input } from './input';
import { FieldWrapper } from './fieldWrapper';

type Props = {
  label?: string;
  required?: boolean;
  state?: 'default' | 'error' | 'positive' | 'expire';
  messages?: 'default' | 'error' | 'positive' | 'expire' | undefined;
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
}: Props) {
  const [front, setFront] = React.useState('');
  const [middle, setMiddle] = React.useState('');
  const [back, setBack] = React.useState('');

  const frontRef = React.useRef<HTMLInputElement>(null);
  const middleRef = React.useRef<HTMLInputElement>(null);
  const backRef = React.useRef<HTMLInputElement>(null);

  const onlyNumber = (v: string) => v.replace(/\D/g, '');

  // 앞 6자리
  const handleFrontChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nums = onlyNumber(e.target.value).slice(0, 6);
    setFront(nums);

    if (nums.length === 6) {
      middleRef.current?.focus();
    }
  };

  // 뒷 첫 자리
  const handleMiddleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nums = onlyNumber(e.target.value).slice(0, 1);
    setMiddle(nums);

    if (nums.length === 1) {
      backRef.current?.focus();
    }
  };

  // 뒷 6자리
  const handleBackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nums = onlyNumber(e.target.value).slice(0, 6);
    setBack(nums);
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

  // 전체 값 완성 시 콜백
  React.useEffect(() => {
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
      <div className="flex items-center gap-3 relative">
        {/* 앞 6자리 */}
        <div onClick={() => frontRef.current?.focus()}>
          <Input
            ref={frontRef}
            inputMode="numeric"
            maxLength={6}
            value={front}
            onChange={handleFrontChange}
            onKeyDown={(e) => handleKeyDown(e, 'front')}
            placeholder="●●●●●●"
            disabled={disabled}
            className="w-40 text-left tracking-widest"
          />
        </div>

        <span>-</span>

        {/* 뒷 첫 자리 */}
        <div onClick={() => middleRef.current?.focus()}>
          <Input
            ref={middleRef}
            inputMode="numeric"
            maxLength={1}
            value={middle}
            onChange={handleMiddleChange}
            onKeyDown={(e) => handleKeyDown(e, 'middle')}
            placeholder="●"
            disabled={disabled}
            className="w-12 text-left "
          />
        </div>

        {/* 뒤 6자리 UI (항상 진한 dot) */}
        <div
          className="flex items-center text-black text-xl tracking-widest cursor-text"
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
          disabled={disabled}
          className="absolute opacity-0"
        />
      </div>
    </FieldWrapper>
  );
}
