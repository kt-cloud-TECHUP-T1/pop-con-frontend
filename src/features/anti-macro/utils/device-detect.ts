import type { DeviceDetection, DeviceType } from '../types';

export function detectDevice(): DeviceDetection {
  const uaIsMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(
    navigator.userAgent,
  );
  const hasTouchSupport =
    'ontouchstart' in window || navigator.maxTouchPoints > 0;

  const mismatch = uaIsMobile !== hasTouchSupport;

  let resolved: DeviceType;
  if (uaIsMobile && hasTouchSupport) {
    resolved = 'mobile';
  } else if (!uaIsMobile && !hasTouchSupport) {
    resolved = 'desktop';
  } else {
    resolved = 'unknown';
  }

  return { uaIsMobile, hasTouchSupport, resolved, mismatch };
}
