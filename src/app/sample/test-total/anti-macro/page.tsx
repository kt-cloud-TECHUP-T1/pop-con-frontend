'use client';

export default function AntiMacroDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Anti-Macro Dashboard</h1>
          <p className="text-gray-500">각 페이지에서 raw 데이터를 수집하고 서버에서 분석합니다</p>
        </div>

        {/* 테스트 페이지 네비게이션 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <a
            href="/sample/test-total/anti-macro/login"
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="text-3xl mb-2">1</div>
            <h2 className="font-bold text-lg mb-1">로그인</h2>
            <p className="text-sm text-gray-500">
              fingerprint + honeypot + mouse + environment + click + timing
            </p>
          </a>
          <a
            href="/sample/test-total/anti-macro/popup-detail"
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="text-3xl mb-2">2</div>
            <h2 className="font-bold text-lg mb-1">팝업 상세</h2>
            <p className="text-sm text-gray-500">
              click-behavior + timing + mouse
            </p>
          </a>
          <a
            href="/sample/test-total/anti-macro/draw-apply"
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="text-3xl mb-2">3</div>
            <h2 className="font-bold text-lg mb-1">드로우 신청</h2>
            <p className="text-sm text-gray-500">
              click-behavior + mouse + timing
            </p>
          </a>
        </div>

        {/* 구조 설명 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="font-bold mb-4">프론트/백엔드 분리 구조</h2>
          <div className="space-y-3 text-sm text-gray-600">
            <p><strong>프론트엔드:</strong> raw 데이터만 수집 (클릭 좌표, 마우스 경로, 타이밍, 환경 정보 등)</p>
            <p><strong>백엔드 (Spring):</strong> 임계값 비교 → 시그널 판정 → 점수 합산 → VQA 난이도 결정 → pass/fail</p>
            <p className="text-xs text-gray-400">현재 Next.js API Route가 Spring 백엔드 스텁 역할</p>
          </div>
        </div>
      </div>
    </div>
  );
}
