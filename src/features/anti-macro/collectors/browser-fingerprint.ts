import FingerprintJS from '@fingerprintjs/fingerprintjs';
import type { BrowserFingerprint, SignalCollector } from '../types';

async function collectFingerprint(): Promise<BrowserFingerprint> {
  const fp = await FingerprintJS.load();
  const result = await fp.get();

  const components = result.components as Record<string, { value: unknown }>;

  // WebGL renderer/vendor 추출
  let webglRenderer: string | null = null;
  let webglVendor: string | null = null;
  const webgl = components.webGlBasics?.value;
  if (webgl && typeof webgl === 'object' && webgl !== null) {
    const gl = webgl as Record<string, unknown>;
    webglRenderer = (gl.renderer as string) ?? null;
    webglVendor = (gl.vendor as string) ?? null;
  }

  return {
    visitorId: result.visitorId,
    confidence: result.confidence.score,
    webdriver: !!navigator.webdriver,
    webglRenderer,
    webglVendor,
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    languages: navigator.languages,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screenResolution: { width: screen.width, height: screen.height },
    colorDepth: screen.colorDepth,
    hardwareConcurrency: navigator.hardwareConcurrency,
    deviceMemory: (navigator as unknown as { deviceMemory?: number })
      .deviceMemory,
    components: Object.fromEntries(
      Object.entries(components).map(([k, v]) => [k, v.value])
    ),
  };
}

export function createBrowserFingerprintCollector(): SignalCollector & {
  getFingerprint(): BrowserFingerprint | null;
  loadAsync(): Promise<void>;
} {
  let fingerprint: BrowserFingerprint | null = null;
  let loading: Promise<void> | null = null;

  return {
    start() {
      // 비동기 수집 시작 - loadAsync()로 완료 대기 가능
      loading = collectFingerprint()
        .then((fp) => {
          fingerprint = fp;
        })
        .catch(() => {
          // fingerprintjs 로드 실패 시 기본값
          fingerprint = null;
        });
    },

    async loadAsync() {
      if (loading) await loading;
    },

    stop() {
      // 정적 수집이므로 정리할 항목 없음
    },

    getRawData() {
      return fingerprint;
    },

    getFingerprint() {
      return fingerprint;
    },

    reset() {
      fingerprint = null;
      loading = null;
    },
  };
}
