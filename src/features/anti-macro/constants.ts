// --- 프론트엔드 수집 설정 ---
export const COLLECTION = {
  /** 이벤트 최대 저장 수 */
  MAX_EVENTS: 500,
} as const;

// --- 안티매크로 API (Next.js 프록시) ---
export const ANTI_MACRO_API_BASE = '/api/anti-macro';
