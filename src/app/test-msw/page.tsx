'use client';

import { useState } from 'react';

export default function TestMSW() {
  const [data, setData] = useState(null);

  const handleTest = async (id: string) => {
    try {
      const res = await fetch('/auth/identity/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identityVerificationId: id }),
      });
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-10 flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-gray-800">MSW 인증 테스트</h1>

      <div className="flex gap-2">
        <button
          className="px-4 py-2 border cursor-pointer"
          onClick={() => handleTest('iv_new_user')}
        >
          신규 회원 테스트
        </button>

        <button
          className="px-4 py-2 border cursor-pointer"
          onClick={() => handleTest('iv_existing')}
        >
          기존 회원 테스트
        </button>

        <button
          className="px-4 py-2 border cursor-pointer"
          onClick={() => handleTest('iv_underage')}
        >
          미성년자 에러 테스트
        </button>
      </div>

      <hr className="my-4" />

      <h2 className="text-lg font-semibold">API 응답 결과:</h2>
      <div className="p-4 bg-gray-100 min-h-[200px]">
        {data && (
          <pre className="text-sm font-mono overflow-x-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
