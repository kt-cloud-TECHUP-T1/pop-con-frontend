// --- 수집기 인터페이스 ---
export interface SignalCollector {
  start(): void;
  stop(): void;
  getRawData(): unknown;
  reset(): void;
}

// --- 브라우저 핑거프린트 ---
// 백엔드 스코어링에 실제 사용되는 필드만 전송
export type BrowserFingerprint = {
  visitorId: string;
  confidence: number;
  webdriver: boolean;
  webglRenderer: string | null;
  webglVendor: string | null;
  language: string;
  timezone: string;
};

// --- 포인트 / 클릭 ---
export type PointEvent = {
  x: number;
  y: number;
  timestamp: number;
  isTrusted: boolean;
};

export type ClickEvent = PointEvent & {
  targetSelector: string;
  /** 클릭 좌표와 버튼 정중앙까지의 거리 (px). 버튼 클릭이 아니면 null */
  centerDistance: number | null;
};

// --- 타이밍 ---
export type TimingData = {
  pageLoadTimestamp: number;
  firstInteractionTimestamp: number | null;
  loadToFirstClickMs: number | null;
  tabFocusedDuringClicks: boolean;
};

// --- 허니팟 ---
export type HoneypotData = {
  triggered: boolean;
  fieldValue: string | null;
};

// --- 페이지 페이로드 ---
export type PageType = 'login' | 'popup-detail' | 'draw-application' | 'dutch-auction-detail' | 'dutch-auction-application';

export type PageSignalPayload = {
  page: PageType;
  collectedAt: number;
  fingerprint?: BrowserFingerprint;
  rawData: {
    clicks?: ClickEvent[];
    mouseMovements?: PointEvent[];
    hasUntrustedEvent?: boolean;
    timing?: TimingData;
    honeypot?: HoneypotData;
    environment?: {
      timezone: string;
      language: string;
    };
  };
};

// --- 제출 ---
export type AntiMacroSubmission = {
  timestamp: number;
  payload: PageSignalPayload;
  visitorId?: string;
  userId?: string;
};

export type VqaLevel = 1 | 2 | 3 | 4;

export type SignalSubmitResponse = {
  received: boolean;
  score?: number;
  vqaLevel?: VqaLevel;
  drawResult?: 'pass' | 'fail';
};
