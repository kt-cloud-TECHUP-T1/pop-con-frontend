import type { SignalCollector, TimingData } from '../types';

export function createTimingCollector(): SignalCollector {
  let pageLoadTimestamp = 0;
  let firstInteractionTimestamp: number | null = null;
  let tabWasHiddenDuringClick = false;
  const cleanupFns: (() => void)[] = [];

  function onFirstInteraction() {
    if (firstInteractionTimestamp === null) {
      firstInteractionTimestamp = Date.now();
    }
  }

  function onClick() {
    onFirstInteraction();
    if (document.visibilityState === 'hidden') {
      tabWasHiddenDuringClick = true;
    }
  }

  return {
    start() {
      pageLoadTimestamp = Date.now();

      document.addEventListener('click', onClick, true);
      document.addEventListener('keydown', onFirstInteraction, { once: true, passive: true });

      cleanupFns.push(
        () => document.removeEventListener('click', onClick, true),
        () => document.removeEventListener('keydown', onFirstInteraction),
      );
    },

    stop() {
      cleanupFns.forEach((fn) => fn());
      cleanupFns.length = 0;
    },

    getRawData(): TimingData {
      const loadToClick = firstInteractionTimestamp
        ? firstInteractionTimestamp - pageLoadTimestamp
        : null;

      return {
        pageLoadTimestamp,
        firstInteractionTimestamp,
        loadToFirstClickMs: loadToClick,
        tabFocusedDuringClicks: !tabWasHiddenDuringClick,
      };
    },

    reset() {
      pageLoadTimestamp = 0;
      firstInteractionTimestamp = null;
      tabWasHiddenDuringClick = false;
    },
  };
}
