'use client';

import { useState } from 'react';
import { useLoginCollector } from '@/features/anti-macro/hooks/use-login-collector';

export default function AntiMacroLoginTest() {
  const {
    honeypotProps,
    honeypotOverlayProps,
    honeypotWrapperProps,
    getPayload,
    submitSignals,
    isSubmitting,
    lastResponse,
    getFingerprint,
  } = useLoginCollector();

  const [debugData, setDebugData] = useState<Record<string, unknown> | null>(null);

  const handleLogin = async (provider: string) => {
    const response = await submitSignals();
    setDebugData({
      provider,
      payload: getPayload(),
      serverResponse: response,
    });
  };

  const fingerprint = getFingerprint();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 로그인 UI */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-2xl font-bold text-center mb-8">로그인</h1>

          <div className="space-y-4 max-w-sm mx-auto">
            <button
              onClick={() => handleLogin('kakao')}
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-yellow-400 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-yellow-500 transition-colors"
            >
              카카오 로그인
            </button>

            <button
              onClick={() => handleLogin('naver')}
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-green-500 text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-green-600 transition-colors"
            >
              네이버 로그인
            </button>
          </div>

          {/* Honeypot - visually hidden */}
          <div {...honeypotWrapperProps}>
            <input {...honeypotProps} />
            <div {...honeypotOverlayProps} />
          </div>

          {isSubmitting && (
            <p className="text-center mt-4 text-gray-500">시그널 전송 중...</p>
          )}
        </div>

        {/* 디버그 패널 */}
        <div className="bg-gray-900 text-green-400 rounded-lg shadow-sm p-6 font-mono text-xs overflow-auto max-h-[80vh]">
          <h2 className="text-white text-lg font-bold mb-4">Debug Panel</h2>

          <section className="mb-4">
            <h3 className="text-yellow-400 font-bold mb-2">Browser Fingerprint</h3>
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(fingerprint, null, 2)}
            </pre>
          </section>

          <section className="mb-4">
            <h3 className="text-yellow-400 font-bold mb-2">Current Raw Data</h3>
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(getPayload().rawData, null, 2)}
            </pre>
          </section>

          {lastResponse && (
            <section className="mb-4">
              <h3 className="text-yellow-400 font-bold mb-2">Server Response</h3>
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(lastResponse, null, 2)}
              </pre>
            </section>
          )}

          {debugData && (
            <section>
              <h3 className="text-yellow-400 font-bold mb-2">Last Submit</h3>
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(debugData, null, 2)}
              </pre>
            </section>
          )}
        </div>
      </div>

      {/* 네비게이션 */}
      <div className="max-w-4xl mx-auto mt-8 flex gap-4">
        <a
          href="/sample/test-total/anti-macro"
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          대시보드
        </a>
        <a
          href="/sample/test-total/anti-macro/popup-detail"
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          다음: 팝업 상세 →
        </a>
      </div>
    </div>
  );
}
