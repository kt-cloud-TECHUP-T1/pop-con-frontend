import { NextRequest, NextResponse } from 'next/server';
import type { AntiMacroSubmission } from '@/features/anti-macro/types';

// ============================================================
// 아래 상수/로직은 실제로는 Spring 백엔드에 구현됩니다.
// Next.js API Route는 개발용 스텁입니다.
// ============================================================

// --- 시그널 가중치 (tier + weight) ---
type SignalTier = 'hard' | 'medium' | 'soft';

const SIGNAL_WEIGHTS: Record<string, { tier: SignalTier; weight: number }> = {
  // Hard (30-50)
  webdriver_detected: { tier: 'hard', weight: 50 },
  honeypot_triggered: { tier: 'hard', weight: 40 },
  zero_mouse_events: { tier: 'hard', weight: 30 },
  untrusted_event: { tier: 'hard', weight: 50 },
  click_speed_inhuman: { tier: 'hard', weight: 40 },

  // Medium (10-20)
  click_button_center: { tier: 'medium', weight: 20 },
  click_interval_uniform: { tier: 'medium', weight: 15 },
  timezone_language_mismatch: { tier: 'medium', weight: 10 },
  abnormal_webgl: { tier: 'medium', weight: 15 },

  // Soft (3-7)
  fast_load_to_click: { tier: 'soft', weight: 5 },
  tab_not_focused: { tier: 'soft', weight: 5 },
  low_fingerprint_confidence: { tier: 'soft', weight: 5 },
  non_korean_language: { tier: 'soft', weight: 3 },
};

// --- 임계값 ---
const THRESHOLDS = {
  FAST_CLICK_MS: 500,
  INHUMAN_CLICK_INTERVAL_MS: 50,
  CLICK_INTERVAL_STDDEV_MS: 20,
  BUTTON_CENTER_DISTANCE_PX: 1,
  BUTTON_CENTER_RATIO: 0.8,
  FINGERPRINT_CONFIDENCE_MIN: 0.3,
} as const;

// --- VQA 난이도 기준 ---
const VQA_DIFFICULTY = {
  EASY_MAX: 20,
  MEDIUM_MAX: 50,
} as const;

// --- 의심 WebGL 렌더러 ---
const SUSPICIOUS_WEBGL_RENDERERS = ['swiftshader', 'llvmpipe', 'mesa', 'virtualbox'];

// --- 유틸: 표준편차 ---
function stddev(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const squaredDiffs = values.map((v) => (v - mean) ** 2);
  return Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / values.length);
}

// --- rawData에서 시그널 분석 ---
type DetectedSignal = { name: string; tier: SignalTier; weight: number; value: unknown };

function analyzeRawData(payload: AntiMacroSubmission['payload']): DetectedSignal[] {
  const detected: DetectedSignal[] = [];
  const { rawData, fingerprint } = payload;

  // === fingerprint 기반 시그널 ===
  if (fingerprint) {
    // Hard: webdriver 감지
    if (fingerprint.webdriver) {
      detected.push({
        ...SIGNAL_WEIGHTS.webdriver_detected,
        name: 'webdriver_detected',
        value: true,
      });
    }

    // Medium: 비정상 WebGL 렌더러
    const renderer = (fingerprint.webglRenderer ?? '').toLowerCase();
    const isSuspicious = SUSPICIOUS_WEBGL_RENDERERS.some((s) => renderer.includes(s));
    if (isSuspicious || !fingerprint.webglRenderer) {
      detected.push({
        ...SIGNAL_WEIGHTS.abnormal_webgl,
        name: 'abnormal_webgl',
        value: { renderer: fingerprint.webglRenderer, vendor: fingerprint.webglVendor },
      });
    }

    // Soft: 낮은 fingerprint confidence
    if (fingerprint.confidence < THRESHOLDS.FINGERPRINT_CONFIDENCE_MIN) {
      detected.push({
        ...SIGNAL_WEIGHTS.low_fingerprint_confidence,
        name: 'low_fingerprint_confidence',
        value: fingerprint.confidence,
      });
    }
  }

  // === 클릭 행동 시그널 ===
  const clicks = rawData.clicks ?? [];
  if (clicks.length >= 2) {
    // Medium: 버튼 정중앙 클릭 비율
    const buttonClicks = clicks.filter((c) => c.centerDistance !== null);
    if (buttonClicks.length >= 2) {
      const centerClicks = buttonClicks.filter(
        (c) => c.centerDistance! < THRESHOLDS.BUTTON_CENTER_DISTANCE_PX,
      );
      const centerRatio = centerClicks.length / buttonClicks.length;
      if (centerRatio >= THRESHOLDS.BUTTON_CENTER_RATIO) {
        detected.push({
          ...SIGNAL_WEIGHTS.click_button_center,
          name: 'click_button_center',
          value: { centerRatio, buttonClickCount: buttonClicks.length },
        });
      }
    }

    // 클릭 간격 계산
    const intervals: number[] = [];
    for (let i = 1; i < clicks.length; i++) {
      intervals.push(clicks[i].timestamp - clicks[i - 1].timestamp);
    }

    // Hard: 비현실적 클릭 속도
    const inhumanClicks = intervals.filter((ms) => ms < THRESHOLDS.INHUMAN_CLICK_INTERVAL_MS);
    if (inhumanClicks.length > 0) {
      detected.push({
        ...SIGNAL_WEIGHTS.click_speed_inhuman,
        name: 'click_speed_inhuman',
        value: { inhumanCount: inhumanClicks.length, minInterval: Math.min(...inhumanClicks) },
      });
    }

    // Medium: 클릭 간격 일정성
    if (intervals.length >= 2) {
      const intervalStddev = stddev(intervals);
      if (intervalStddev < THRESHOLDS.CLICK_INTERVAL_STDDEV_MS) {
        detected.push({
          ...SIGNAL_WEIGHTS.click_interval_uniform,
          name: 'click_interval_uniform',
          value: { stddev: intervalStddev },
        });
      }
    }
  }

  // === 마우스 시그널 ===
  const movements = rawData.mouseMovements ?? [];

  // Hard: untrusted 이벤트
  if (rawData.hasUntrustedEvent) {
    detected.push({
      ...SIGNAL_WEIGHTS.untrusted_event,
      name: 'untrusted_event',
      value: true,
    });
  }

  // Hard: 마우스 이벤트 0건
  if (movements.length === 0) {
    detected.push({
      ...SIGNAL_WEIGHTS.zero_mouse_events,
      name: 'zero_mouse_events',
      value: { mouseEvents: 0 },
    });
  }

  // === 타이밍 시그널 ===
  const timing = rawData.timing;
  if (timing) {
    // Soft: 로드 → 첫 클릭이 너무 빠름
    if (
      timing.loadToFirstClickMs !== null &&
      timing.loadToFirstClickMs < THRESHOLDS.FAST_CLICK_MS
    ) {
      detected.push({
        ...SIGNAL_WEIGHTS.fast_load_to_click,
        name: 'fast_load_to_click',
        value: { loadToClickMs: timing.loadToFirstClickMs },
      });
    }

    // Soft: 탭 비활성 중 클릭
    if (!timing.tabFocusedDuringClicks) {
      detected.push({
        ...SIGNAL_WEIGHTS.tab_not_focused,
        name: 'tab_not_focused',
        value: true,
      });
    }
  }

  // === 허니팟 시그널 ===
  const honeypot = rawData.honeypot;
  if (honeypot?.triggered) {
    detected.push({
      ...SIGNAL_WEIGHTS.honeypot_triggered,
      name: 'honeypot_triggered',
      value: { fieldValue: honeypot.fieldValue },
    });
  }

  // === 환경 시그널 ===
  const env = rawData.environment;
  if (env) {
    // Medium: 타임존이 Asia/Seoul이 아님
    if (env.timezone !== 'Asia/Seoul') {
      detected.push({
        ...SIGNAL_WEIGHTS.timezone_language_mismatch,
        name: 'timezone_language_mismatch',
        value: { timezone: env.timezone, language: env.language },
      });
    }

    // Soft: 언어가 ko/en이 아님
    const langPrefix = env.language.split('-')[0].toLowerCase();
    if (langPrefix !== 'ko' && langPrefix !== 'en') {
      detected.push({
        ...SIGNAL_WEIGHTS.non_korean_language,
        name: 'non_korean_language',
        value: { language: env.language },
      });
    }

  }

  return detected;
}

// --- API 핸들러 ---
export async function POST(request: NextRequest) {
  const body: AntiMacroSubmission = await request.json();
  const { payload } = body;

  // TODO: nonce 유효성 검증 + 서명 재계산 비교 (Spring에서 구현)

  // rawData 분석 → 시그널 감지
  const detectedSignals = analyzeRawData(payload);

  // 점수 합산
  const score = detectedSignals.reduce((sum, s) => sum + s.weight, 0);

  // VQA 난이도 결정
  let vqaDifficulty: 'easy' | 'medium' | 'hard';
  if (score <= VQA_DIFFICULTY.EASY_MAX) {
    vqaDifficulty = 'easy';
  } else if (score <= VQA_DIFFICULTY.MEDIUM_MAX) {
    vqaDifficulty = 'medium';
  } else {
    vqaDifficulty = 'hard';
  }

  // 드로우 신청 페이지에서의 최종 판정
  let drawResult: 'pass' | 'fail' | undefined;
  if (payload.page === 'draw-application') {
    drawResult = score > VQA_DIFFICULTY.MEDIUM_MAX ? 'fail' : 'pass';
  }

  console.log(`[anti-macro] page=${payload.page} score=${score} vqa=${vqaDifficulty}`, {
    detectedSignals: detectedSignals.map((s) => `${s.name}(${s.weight})`),
    deviceId: body.deviceId,
  });

  return NextResponse.json({
    received: true,
    score,
    vqaDifficulty,
    drawResult,
  });
}
