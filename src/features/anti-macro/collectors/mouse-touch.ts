import type { PointEvent, SignalCollector, TouchPath } from '../types';
import { COLLECTION } from '../constants';

export function createMouseTouchCollector(): SignalCollector & {
  getMovements(): PointEvent[];
  getTouchPaths(): TouchPath[];
} {
  let movements: PointEvent[] = [];
  let touchPaths: TouchPath[] = [];
  let currentTouchPath: PointEvent[] = [];
  let hasUntrustedEvent = false;
  let rafId: number | null = null;
  let pendingEvent: { x: number; y: number; isTrusted: boolean; type: 'mouse' | 'touch' } | null = null;
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

  function throttledPush(x: number, y: number, isTrusted: boolean, type: 'mouse' | 'touch') {
    if (!isTrusted) hasUntrustedEvent = true;
    pendingEvent = { x, y, isTrusted, type };
    if (rafId === null) {
      rafId = requestAnimationFrame(flushPending);
    }
  }

  function onMouseMove(e: MouseEvent) {
    throttledPush(e.clientX, e.clientY, e.isTrusted, 'mouse');
  }

  function onTouchStart(e: TouchEvent) {
    if (!e.isTrusted) hasUntrustedEvent = true;
    const touch = e.touches[0];
    if (!touch) return;
    currentTouchPath = [{
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now(),
      isTrusted: e.isTrusted,
      type: 'touch',
    }];
  }

  function onTouchMove(e: TouchEvent) {
    if (!e.isTrusted) hasUntrustedEvent = true;
    const touch = e.touches[0];
    if (!touch) return;

    if (currentTouchPath.length < COLLECTION.MAX_EVENTS) {
      currentTouchPath.push({
        x: touch.clientX,
        y: touch.clientY,
        timestamp: Date.now(),
        isTrusted: e.isTrusted,
        type: 'touch',
      });
    }
  }

  function onTouchEnd(e: TouchEvent) {
    if (!e.isTrusted) hasUntrustedEvent = true;
    if (currentTouchPath.length > 0) {
      touchPaths.push({
        points: [...currentTouchPath],
        startTimestamp: currentTouchPath[0].timestamp,
        endTimestamp: Date.now(),
      });
      currentTouchPath = [];
    }
  }

  return {
    start() {
      document.addEventListener('mousemove', onMouseMove, { passive: true });
      document.addEventListener('touchstart', onTouchStart, { passive: true });
      document.addEventListener('touchmove', onTouchMove, { passive: true });
      document.addEventListener('touchend', onTouchEnd, { passive: true });

      cleanupFns.push(
        () => document.removeEventListener('mousemove', onMouseMove),
        () => document.removeEventListener('touchstart', onTouchStart),
        () => document.removeEventListener('touchmove', onTouchMove),
        () => document.removeEventListener('touchend', onTouchEnd),
      );
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
      return { movements, touchPaths, hasUntrustedEvent };
    },

    getMovements() {
      return movements;
    },

    getTouchPaths() {
      return touchPaths;
    },

    reset() {
      movements = [];
      touchPaths = [];
      currentTouchPath = [];
      hasUntrustedEvent = false;
    },
  };
}
