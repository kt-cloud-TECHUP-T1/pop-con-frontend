'use client';

import { useMemo } from 'react';
import { createClickBehaviorCollector } from '../collectors/click-behavior';
import { createMouseCollector } from '../collectors/mouse-touch';
import { createTimingCollector } from '../collectors/timing';
import { useAntiMacro } from './use-anti-macro';
import type { PageType } from '../types';

type UseApplyPageCollectorOptions = {
  page?: Extract<PageType, 'draw-application' | 'dutch-auction-application'>;
  userId: string;
};

export function useApplyPageCollector({
  page = 'draw-application',
  userId,
}: UseApplyPageCollectorOptions) {
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

  const { getPayload, submitSignals } = useAntiMacro({
    page,
    collectors,
    userId,
  });

  return {
    getPayload,
    submitSignals,
    getClicks: () => clickCollector.getClicks(),
    getMovements: () => mouseCollector.getMovements(),
  };
}
