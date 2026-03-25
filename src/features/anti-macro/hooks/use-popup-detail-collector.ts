'use client';

import { useMemo } from 'react';
import { createClickBehaviorCollector } from '../collectors/click-behavior';
import { createTimingCollector } from '../collectors/timing';
import { createMouseCollector } from '../collectors/mouse-touch';
import { useAntiMacro } from './use-anti-macro';

export function usePopupDetailCollector() {
  const { clickCollector, collectors } = useMemo(() => {
    const click = createClickBehaviorCollector();
    const timing = createTimingCollector();
    const mouse = createMouseCollector();

    return {
      clickCollector: click,
      collectors: [click, timing, mouse],
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
