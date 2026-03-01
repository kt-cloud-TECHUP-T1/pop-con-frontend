'use client';

import { useState } from 'react';

type ApiResult = Record<string, unknown>;

export default function TestMSW() {
  const [data, setData] = useState<ApiResult | null>(null);

  const handleTest = async (id: string) => {
    try {
      const res = await fetch('/api/auth/identity/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identityVerificationId: id }),
      });

      const contentType = res.headers.get('content-type') || '';

      if (contentType.includes('application/json')) {
        const result = (await res.json()) as ApiResult;
        setData(result);
        return;
      }

      const text = await res.text();
      setData({
        error: 'JSON이 아닌 응답을 받았습니다.',
        status: res.status,
        contentType,
        preview: text.slice(0, 200),
      });
    } catch (error) {
      console.error(error);
      setData({
        error: '요청 처리 중 예외가 발생했습니다.',
      });
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
