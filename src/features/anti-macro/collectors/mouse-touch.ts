import type { PointEvent, SignalCollector } from '../types';
import { COLLECTION } from '../constants';

export function createMouseCollector(): SignalCollector & {
  getMovements(): PointEvent[];
} {
  let movements: PointEvent[] = [];
  let hasUntrustedEvent = false;
  let rafId: number | null = null;
  let pendingEvent: { x: number; y: number; isTrusted: boolean } | null = null;
  const cleanupFns: (() => void)[] = [];

  function flushPending() {
    if (pendingEvent && movements.length < COLLECTION.MAX_EVENTS) {
      movements.push({
        ...pendingEvent,
        timestamp: Date.now(),
      });
      pendingEvent = null;
    }
    rafId = null;
  }

  function onMouseMove(e: MouseEvent) {
    if (!e.isTrusted) hasUntrustedEvent = true;
    pendingEvent = { x: e.clientX, y: e.clientY, isTrusted: e.isTrusted };
    if (rafId === null) {
      rafId = requestAnimationFrame(flushPending);
    }
  }

  return {
    start() {
      document.addEventListener('mousemove', onMouseMove, { passive: true });
      cleanupFns.push(() => document.removeEventListener('mousemove', onMouseMove));
    },

    stop() {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      cleanupFns.forEach((fn) => fn());
      cleanupFns.length = 0;
    },

    getRawData() {
      return { movements, hasUntrustedEvent };
    },

    getMovements() {
      return movements;
    },

    reset() {
      movements = [];
      hasUntrustedEvent = false;
    },
  };
}
