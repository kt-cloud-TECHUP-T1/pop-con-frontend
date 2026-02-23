'use client';

import { IdentityNumberInput } from '@/components/ui/identityNumberInput';
import { useState } from 'react';

export default function Home() {
  const [identity, setIdentity] = useState('');

  return (
    <div className="w-[400px]">
      <IdentityNumberInput
        label="주민등록번호"
        required
        state="default"
        messages={{
          default: '주민등록번호를 입력해주세요.',
          error: 'error',
          expire: 'expire',
        }}
        onComplete={(identity) => {
          console.log('완성된 주민번호:', identity);
          setIdentity(identity);
        }}
      />

      <button onClick={() => console.log('identity', identity)}>+</button>
    </div>
  );
}
