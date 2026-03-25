'use client';

import { useMemo } from 'react';
import { createClickBehaviorCollector } from '../collectors/click-behavior';
import { createMouseTouchCollector } from '../collectors/mouse-touch';
import { createTimingCollector } from '../collectors/timing';
import { useAntiMacro } from './use-anti-macro';

export function useDrawApplyCollector() {
  const { clickCollector, mouseTouchCollector, collectors } = useMemo(() => {
    const click = createClickBehaviorCollector();
    const mt = createMouseTouchCollector();
    const timing = createTimingCollector();

    return {
      clickCollector: click,
      mouseTouchCollector: mt,
      collectors: [click, mt, timing],
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
    getTouchPaths: () => mouseTouchCollector.getTouchPaths(),
    getMovements: () => mouseTouchCollector.getMovements(),
  };
}
