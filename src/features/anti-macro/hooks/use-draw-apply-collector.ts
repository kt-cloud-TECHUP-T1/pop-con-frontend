'use client';

import { useMemo } from 'react';
import { createClickBehaviorCollector } from '../collectors/click-behavior';
import { createMouseCollector } from '../collectors/mouse-touch';
import { createTimingCollector } from '../collectors/timing';
import { useAntiMacro } from './use-anti-macro';

export function useDrawApplyCollector() {
  const { clickCollector, mouseCollector, collectors } = useMemo(() => {
    const click = createClickBehaviorCollector();
    const mouse = createMouseCollector();
    const timing = createTimingCollector();

    return {
      clickCollector: click,
      mouseCollector: mouse,
      collectors: [click, mouse, timing],
    };
  }, []);

  const { getPayload, submitSignals, isSubmitting, lastResponse } = useAntiMacro({
    page: 'draw-application',
    collectors,
  });

  return {
    getPayload,
    submitSignals,
    isSubmitting,
    lastResponse,
    getClicks: () => clickCollector.getClicks(),
    getMovements: () => mouseCollector.getMovements(),
  };
}
