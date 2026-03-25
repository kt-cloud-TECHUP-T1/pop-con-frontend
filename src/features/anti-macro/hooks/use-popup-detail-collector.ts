'use client';

import { useMemo } from 'react';
import { createClickBehaviorCollector } from '../collectors/click-behavior';
import { createTimingCollector } from '../collectors/timing';
import { createMouseTouchCollector } from '../collectors/mouse-touch';
import { useAntiMacro } from './use-anti-macro';

export function usePopupDetailCollector() {
  const { clickCollector, collectors } = useMemo(() => {
    const click = createClickBehaviorCollector();
    const timing = createTimingCollector();
    const mt = createMouseTouchCollector();

    return {
      clickCollector: click,
      collectors: [click, timing, mt],
    };
  }, []);

  const { getPayload, submitSignals, isSubmitting, lastResponse } = useAntiMacro({
    page: 'popup-detail',
    collectors,
  });

  return {
    getPayload,
    submitSignals,
    isSubmitting,
    lastResponse,
    getClicks: () => clickCollector.getClicks(),
  };
}
