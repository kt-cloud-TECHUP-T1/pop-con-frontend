'use client';

import { useMemo } from 'react';
import { createBrowserFingerprintCollector } from '../collectors/browser-fingerprint';
import { createClickBehaviorCollector } from '../collectors/click-behavior';
import { createHoneypotCollector } from '../collectors/honeypot';
import { createMouseTouchCollector } from '../collectors/mouse-touch';
import { createEnvironmentCollector } from '../collectors/environment';
import { createTimingCollector } from '../collectors/timing';
import { useAntiMacro } from './use-anti-macro';

export function useLoginCollector() {
  const { fingerprintCollector, honeypotCollector, collectors, getFingerprint } =
    useMemo(() => {
      const fp = createBrowserFingerprintCollector();
      const click = createClickBehaviorCollector();
      const honeypot = createHoneypotCollector();
      const mt = createMouseTouchCollector();
      const env = createEnvironmentCollector();
      const timing = createTimingCollector();

      return {
        fingerprintCollector: fp,
        honeypotCollector: honeypot,
        collectors: [fp, click, honeypot, mt, env, timing],
        getFingerprint: () => fp.getFingerprint(),
      };
    }, []);

  const { getPayload, submitSignals, isSubmitting, lastResponse } = useAntiMacro({
    page: 'login',
    collectors,
    getFingerprint,
  });

  return {
    getPayload,
    submitSignals,
    isSubmitting,
    lastResponse,
    /** 허니팟 input에 적용할 props */
    honeypotProps: honeypotCollector.getHoneypotProps(),
    /** 허니팟을 덮는 overlay props */
    honeypotOverlayProps: honeypotCollector.getOverlayProps(),
    /** 허니팟 wrapper props */
    honeypotWrapperProps: honeypotCollector.getWrapperProps(),
    /** 핑거프린트 원본 데이터 */
    getFingerprint: () => fingerprintCollector.getFingerprint(),
  };
}
