import type { ClickEvent, SignalCollector } from '../types';
import { COLLECTION } from '../constants';

export function createClickBehaviorCollector(): SignalCollector & {
  getClicks(): ClickEvent[];
} {
  let clicks: ClickEvent[] = [];
  const cleanupFns: (() => void)[] = [];

  function onClick(e: MouseEvent) {
    if (clicks.length >= COLLECTION.MAX_EVENTS) return;

    const target = e.target as HTMLElement;
    const selector =
      target.id ? `#${target.id}` :
      target.className ? `.${String(target.className).split(' ')[0]}` :
      target.tagName.toLowerCase();

    // 버튼 정중앙 거리 계산
    const button = target.closest('button, a, [role="button"]') as HTMLElement | null;
    let centerDistance: number | null = null;
    if (button) {
      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const offsetX = e.clientX - centerX;
      const offsetY = e.clientY - centerY;
      centerDistance = Math.sqrt(offsetX * offsetX + offsetY * offsetY);
    }

    clicks.push({
      x: e.clientX,
      y: e.clientY,
      timestamp: Date.now(),
      isTrusted: e.isTrusted,
      targetSelector: selector,
      centerDistance,
    });
  }

  return {
    start() {
      document.addEventListener('click', onClick, true);
      cleanupFns.push(() => document.removeEventListener('click', onClick, true));
    },

    stop() {
      cleanupFns.forEach((fn) => fn());
      cleanupFns.length = 0;
    },

    getRawData() {
      return { clicks };
    },

    getClicks() {
      return clicks;
    },

    reset() {
      clicks = [];
    },
  };
}
