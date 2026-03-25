import type { SignalCollector } from '../types';

export function createEnvironmentCollector(): SignalCollector {
  return {
    start() {
      // 환경 정보는 getRawData() 호출 시 수집
    },

    stop() {},

    getRawData() {
      return {
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
      };
    },

    reset() {},
  };
}
