'use client';

import { useState } from 'react';
import { usePopupDetailCollector } from '@/features/anti-macro/hooks/use-popup-detail-collector';

export default function AntiMacroPopupDetailTest() {
  const {
    getPayload,
    submitSignals,
    isSubmitting,
    lastResponse,
    getClicks,
  } = usePopupDetailCollector();

  const [debugData, setDebugData] = useState<Record<string, unknown> | null>(null);

  const handleDrawParticipate = async () => {
    const response = await submitSignals();
    setDebugData({
      payload: getPayload(),
      serverResponse: response,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 팝업 상세 UI */}
        <div className="lg:col-span-2 space-y-6">
          {/* 이미지 placeholder */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="bg-gray-200 h-64 flex items-center justify-center">
              <span className="text-gray-400 text-lg">팝업스토어 이미지</span>
            </div>
          </div>

          {/* 팝업 정보 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-sm text-gray-500">T1 x POPUP SEOUL</p>
            <h1 className="text-2xl font-bold mt-1">T1 팝업 스토어</h1>
            <div className="flex gap-4 mt-2 text-sm text-gray-500">
              <span>조회 200</span>
              <span>좋아요 200</span>
            </div>

            <div className="mt-6 border-t pt-6">
              <h2 className="text-lg font-bold mb-2">소개</h2>
              <p className="text-gray-600 leading-relaxed">
                Lee가 101 라인 101주년을 기념해 더현대 서울에서 팝업을 진행합니다.
                오랜 시간 쌓아온 데님 헤리티지와 101 라인의 상징성을 공간 안에 풀어냈습니다.
              </p>
            </div>
          </div>
        </div>

        {/* 사이드바 */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm space-y-2 text-gray-600">
              <p>서울 영등포구 여의대로 108, 더현대 서울</p>
              <p>2026.03.14 - 2026.03.22</p>
              <p>평일 11:00 - 21:00 / 주말 10:00 - 22:00</p>
            </div>

            <button
              onClick={handleDrawParticipate}
              disabled={isSubmitting}
              className="w-full mt-6 py-3 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? '처리 중...' : '드로우 참여하기'}
            </button>
          </div>

          {/* 안내사항 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-bold mb-3">안내사항</h3>
            <ul className="text-sm text-gray-600 space-y-2 list-disc pl-4">
              <li>2분마다 가격이 5,000원씩 하락합니다.</li>
              <li>경매 및 드로우 신청은 1인 1회로 제한됩니다.</li>
              <li>당첨자는 신청 마감 후 24시간 내 개별 연락드립니다.</li>
              <li>본인 확인을 위해 신분증을 지참해주세요.</li>
            </ul>
          </div>

          {/* VQA 난이도 결과 */}
          {lastResponse && (
            <div className="bg-white rounded-lg shadow-sm p-6 border-2 border-orange-500">
              <h3 className="font-bold mb-2">VQA 난이도 결정</h3>
              <div className="text-center">
                <span
                  className={`inline-block px-4 py-2 rounded-full font-bold text-white ${
                    lastResponse.vqaDifficulty === 'easy'
                      ? 'bg-green-500'
                      : lastResponse.vqaDifficulty === 'medium'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                  }`}
                >
                  {lastResponse.vqaDifficulty?.toUpperCase()}
                </span>
                <p className="mt-2 text-sm text-gray-500">
                  점수: {lastResponse.score}점
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 디버그 패널 */}
      <div className="max-w-5xl mx-auto mt-8 bg-gray-900 text-green-400 rounded-lg shadow-sm p-6 font-mono text-xs overflow-auto max-h-96">
        <h2 className="text-white text-lg font-bold mb-4">Debug Panel</h2>

        <div className="grid grid-cols-2 gap-4">
          <section>
            <h3 className="text-yellow-400 font-bold mb-2">
              Clicks ({getClicks().length})
            </h3>
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(getClicks().slice(-5), null, 2)}
            </pre>
          </section>

          <section>
            <h3 className="text-yellow-400 font-bold mb-2">Current Raw Data</h3>
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(getPayload().rawData, null, 2)}
            </pre>
          </section>
        </div>

        {debugData && (
          <section className="mt-4">
            <h3 className="text-yellow-400 font-bold mb-2">Last Submit</h3>
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(debugData, null, 2)}
            </pre>
          </section>
        )}
      </div>

      {/* 네비게이션 */}
      <div className="max-w-5xl mx-auto mt-8 flex gap-4">
        <a
          href="/sample/test-total/anti-macro/login"
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          ← 로그인
        </a>
        <a
          href="/sample/test-total/anti-macro"
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          대시보드
        </a>
        <a
          href="/sample/test-total/anti-macro/draw-apply"
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          다음: 드로우 신청 →
        </a>
      </div>
    </div>
  );
}
