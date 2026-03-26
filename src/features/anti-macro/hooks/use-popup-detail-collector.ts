'use client';

import { useMemo } from 'react';
import { createBrowserFingerprintCollector } from '../collectors/browser-fingerprint';
import { createClickBehaviorCollector } from '../collectors/click-behavior';
import { createTimingCollector } from '../collectors/timing';
import { useAntiMacro } from './use-anti-macro';

type UsePopupDetailCollectorOptions = {
  userId?: string;
};

export function usePopupDetailCollector({ userId }: UsePopupDetailCollectorOptions = {}) {
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
    page: 'popup-detail',
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
