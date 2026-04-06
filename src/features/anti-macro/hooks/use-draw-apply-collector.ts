'use client';

import { useMemo } from 'react';
import { createClickBehaviorCollector } from '../collectors/click-behavior';
import { createMouseCollector } from '../collectors/mouse-touch';
import { createTimingCollector } from '../collectors/timing';
import { useAntiMacro } from './use-anti-macro';

type UseDrawApplyCollectorOptions = {
  userId: string;
};

export function useDrawApplyCollector({ userId }: UseDrawApplyCollectorOptions) {
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

  // 신청: userId만 전송
  const { getPayload, submitSignals } = useAntiMacro({
    page: 'draw-application',
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
