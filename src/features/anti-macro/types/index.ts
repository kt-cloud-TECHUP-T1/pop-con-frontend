// --- Collector interface ---
export interface SignalCollector {
  start(): void;
  stop(): void;
  getRawData(): unknown;
  reset(): void;
}

// --- Browser fingerprint ---
export type BrowserFingerprint = {
  visitorId: string;
  confidence: number;
  webdriver: boolean;
  webglRenderer: string | null;
  webglVendor: string | null;
  userAgent: string;
  platform: string;
  language: string;
  languages: readonly string[];
  timezone: string;
  screenResolution: { width: number; height: number };
  colorDepth: number;
  hardwareConcurrency: number;
  deviceMemory: number | undefined;
  components: Record<string, unknown>;
};

// --- Point / Click ---
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

// --- Timing ---
export type TimingData = {
  pageLoadTimestamp: number;
  firstInteractionTimestamp: number | null;
  loadToFirstClickMs: number | null;
  tabFocusedDuringClicks: boolean;
};

// --- Honeypot ---
export type HoneypotData = {
  triggered: boolean;
  fieldValue: string | null;
};

// --- Page payload ---
export type PageType = 'login' | 'popup-detail' | 'draw-application';

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

// --- Submission ---
export type AntiMacroSubmission = {
  timestamp: number;
  payload: PageSignalPayload;
  visitorId?: string;
  userId?: string;
};

export type SignalSubmitResponse = {
  received: boolean;
  score?: number;
  vqaDifficulty?: 'easy' | 'medium' | 'hard';
  drawResult?: 'pass' | 'fail';
};
