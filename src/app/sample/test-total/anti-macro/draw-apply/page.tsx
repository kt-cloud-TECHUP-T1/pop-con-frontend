'use client';

import { useState } from 'react';
import { useDrawApplyCollector } from '@/features/anti-macro/hooks/use-draw-apply-collector';

const TIME_SLOTS = [
  '오전 11:00', '오전 11:30', '오후 12:00',
  '오후 12:30', '오후 01:00', '오후 01:30',
  '오후 02:00', '오후 02:30', '오후 03:00',
  '오후 03:30', '오후 04:00', '오후 04:30',
  '오후 05:00', '오후 05:30', '오후 06:00',
];

const DATES = Array.from({ length: 9 }, (_, i) => ({
  day: 14 + i,
  label: `3월 ${14 + i}일`,
}));

export default function AntiMacroDrawApplyTest() {
  const {
    getPayload,
    submitSignals,
    isSubmitting,
    lastResponse,
    getClicks,
    getMovements,
  } = useDrawApplyCollector();

  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [debugData, setDebugData] = useState<Record<string, unknown> | null>(null);

  const canSubmit = selectedDate !== null && selectedTime !== null && termsAgreed;

  const handleSubmit = async () => {
    const response = await submitSignals();
    setDebugData({
      selection: { date: selectedDate, time: selectedTime, termsAgreed },
      payload: getPayload(),
      serverResponse: response,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">드로우 신청</h1>
        <p className="text-gray-500 mb-8">
          원하는 날짜와 시간을 선택하고 드로우를 신청하세요.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 날짜/시간 선택 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 날짜 선택 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="font-bold mb-4">일정을 선택해주세요</h2>
              <div className="grid grid-cols-5 gap-2">
                {DATES.map((date) => (
                  <button
                    key={date.day}
                    onClick={() => setSelectedDate(date.day)}
                    className={`py-3 px-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedDate === date.day
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {date.day}
                  </button>
                ))}
              </div>
            </div>

            {/* 시간 선택 */}
            {selectedDate && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="font-bold mb-4">
                  3월 {selectedDate}일 회차를 선택해주세요
                </h2>
                <div className="grid grid-cols-3 gap-2">
                  {TIME_SLOTS.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-3 px-4 rounded-lg text-sm transition-colors ${
                        selectedTime === time
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 약관 동의 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="font-bold mb-4">이용약관 동의</h2>
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsAgreed}
                    onChange={(e) => setTermsAgreed(e.target.checked)}
                    className="mt-1 w-5 h-5 accent-orange-500"
                  />
                  <span className="text-sm text-gray-600">
                    (필수) 개인정보 제3자 제공 동의, 당첨 시 본인 확인 및
                    안내를 위해 주차별에 정보를 제공합니다.
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* 응모 정보 요약 */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-bold mb-4">응모 정보 요약</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">선택한 날짜</dt>
                  <dd className="font-medium">
                    {selectedDate ? `2026.03.${selectedDate}` : '-'}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">선택한 시간</dt>
                  <dd className="font-medium">{selectedTime ?? '-'}</dd>
                </div>
              </dl>

              <button
                onClick={handleSubmit}
                disabled={!canSubmit || isSubmitting}
                className="w-full mt-6 py-3 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? '처리 중...' : '응모하기'}
              </button>
            </div>

            {/* 최종 결과 */}
            {lastResponse && (
              <div
                className={`rounded-lg shadow-sm p-6 border-2 ${
                  lastResponse.drawResult === 'pass'
                    ? 'bg-green-50 border-green-500'
                    : 'bg-red-50 border-red-500'
                }`}
              >
                <h3 className="font-bold mb-2">응모 결과</h3>
                <div className="text-center">
                  <span
                    className={`text-3xl font-bold ${
                      lastResponse.drawResult === 'pass'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {lastResponse.drawResult === 'pass' ? 'PASS' : 'FAIL'}
                  </span>
                  <p className="mt-2 text-sm text-gray-500">
                    매크로 점수: {lastResponse.score}점 | VQA: {lastResponse.vqaDifficulty}
                  </p>
                </div>
              </div>
            )}

            {/* 안내사항 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-bold mb-3">안내사항</h3>
              <ul className="text-xs text-gray-500 space-y-2 list-disc pl-4">
                <li>2분마다 가격이 5,000원씩 하락합니다.</li>
                <li>경매별 드로우 신청은 1인 1회로 제한됩니다.</li>
                <li>당첨자는 신청 마감 후 24시간 내 개별 연락드립니다.</li>
                <li>본인 확인을 위해 신분증을 지참해주세요.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 디버그 패널 */}
        <div className="mt-8 bg-gray-900 text-green-400 rounded-lg shadow-sm p-6 font-mono text-xs overflow-auto max-h-96">
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
              <h3 className="text-yellow-400 font-bold mb-2">
                Mouse Movements ({getMovements().length})
              </h3>
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(
                  {
                    count: getMovements().length,
                    last5: getMovements().slice(-5),
                  },
                  null,
                  2,
                )}
              </pre>
            </section>

          </div>

          <section className="mt-4">
            <h3 className="text-yellow-400 font-bold mb-2">Current Raw Data</h3>
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(getPayload().rawData, null, 2)}
            </pre>
          </section>

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
        <div className="mt-8 flex gap-4">
          <a
            href="/sample/test-total/anti-macro/popup-detail"
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            ← 팝업 상세
          </a>
          <a
            href="/sample/test-total/anti-macro"
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            대시보드
          </a>
        </div>
      </div>
    </div>
  );
}
