'use client';

import { useMemo } from 'react';
import { createBrowserFingerprintCollector } from '../collectors/browser-fingerprint';
import { createClickBehaviorCollector } from '../collectors/click-behavior';
import { createTimingCollector } from '../collectors/timing';
import { useAntiMacro } from './use-anti-macro';
import type { PageType } from '../types';

type UseDetailPageCollectorOptions = {
  page?: Extract<PageType, 'popup-detail' | 'dutch-auction-detail'>;
  userId?: string;
};

export function useDetailPageCollector({
  page = 'popup-detail',
  userId,
}: UseDetailPageCollectorOptions = {}) {
  const { fingerprintCollector, clickCollector, collectors } = useMemo(() => {
    const fp = createBrowserFingerprintCollector();
    const click = createClickBehaviorCollector();
    const timing = createTimingCollector();

    return {
      fingerprintCollector: fp,
      clickCollector: click,
      collectors: [fp, click, timing],
    };
  }, []);

  // 상세: visitorId + userId 둘 다 전송
  const getVisitorId = () => fingerprintCollector.getFingerprint()?.visitorId;

  const { getPayload, submitSignals } = useAntiMacro({
    page,
    collectors,
    getVisitorId,
    userId,
  });

  return {
    getPayload,
    submitSignals,
    getClicks: () => clickCollector.getClicks(),
  };
}
