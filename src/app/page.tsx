'use client';

import { useState } from 'react';
import { VerificationInput } from '@/components/ui/verificationInput';
import type { FieldState } from '@/components/ui/fieldWrapper';

export default function Home() {
  const [value, setValue] = useState('');
  const [resendCount, setResendCount] = useState(0);
  const [state, setState] = useState<FieldState>('default');

  return (
    <div className="p-10">
      <div className="w-80">
        <VerificationInput
          key={resendCount}
          label="인증번호"
          required
          value={value}
          onChange={(e) => setValue(e.target.value)}
          state={state}
          duration={60}
          onExpire={() => console.log('만료됨')}
          inputMode="numeric"
          maxLength={6}
          messages={{
            default: '인증번호를 입력해주세요',
            error: '잘못된 인증번호입니다',
            positive: '인증 완료',
            expire: '시간이 만료되었습니다',
          }}
        />

        <button
          onClick={() => {
            setValue('');
            setState('default');
            setResendCount((prev) => prev + 1); // 🔥 key 변경 → 초기화
          }}
          className="mt-4 px-4 py-2 bg-black text-white"
        >
          재전송
        </button>

        <button
          onClick={() => setState('positive')}
          className="mt-2 px-4 py-2 bg-green-600 text-white"
        >
          성공 처리
        </button>
        <button
          onClick={() => setState('error')}
          className="mt-2 px-4 py-2 bg-red-600 text-white"
        >
          에러 처리
        </button>
      </div>
    </div>
  );
}
