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
  touchSupport: boolean;
  maxTouchPoints: number;
  hardwareConcurrency: number;
  deviceMemory: number | undefined;
  components: Record<string, unknown>;
};

// --- Point / Click / Touch ---
export type PointEvent = {
  x: number;
  y: number;
  timestamp: number;
  isTrusted: boolean;
  type: 'mouse' | 'touch';
};

export type ClickEvent = PointEvent & {
  targetSelector: string;
  /** 클릭 좌표와 버튼 정중앙까지의 거리 (px). 버튼 클릭이 아니면 null */
  centerDistance: number | null;
};

export type TouchPath = {
  points: PointEvent[];
  startTimestamp: number;
  endTimestamp: number;
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

// --- Device detection ---
export type DeviceType = 'mobile' | 'desktop' | 'unknown';

export type DeviceDetection = {
  uaIsMobile: boolean;
  hasTouchSupport: boolean;
  resolved: DeviceType;
  mismatch: boolean;
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
    touchPaths?: TouchPath[];
    hasUntrustedEvent?: boolean;
    timing?: TimingData;
    honeypot?: HoneypotData;
    environment?: {
      timezone: string;
      language: string;
      device: DeviceDetection;
    };
  };
};

// --- Submission (signed) ---
export type AntiMacroSubmission = {
  nonce: string;
  timestamp: number;
  payload: PageSignalPayload;
  signature: string;
  deviceId: string;
};

// --- Server responses ---
export type NonceResponse = {
  nonce: string;
  expiresAt: number;
  challenge?: string;
};

export type SignalSubmitResponse = {
  received: boolean;
  score?: number;
  vqaDifficulty?: 'easy' | 'medium' | 'hard';
  drawResult?: 'pass' | 'fail';
};
