'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type {
  PageType,
  PageSignalPayload,
  SignalCollector,
  SignalSubmitResponse,
} from '../types';
import { submitSignals as submitSignalsService } from '../services/submit-signals';

type UseAntiMacroOptions = {
  page: PageType;
  collectors: SignalCollector[];
  /** 핑거프린트 collector에서 가져올 때 사용 */
  getFingerprint?: () => import('../types').BrowserFingerprint | null;
};

type UseAntiMacroReturn = {
  getPayload: () => PageSignalPayload;
  submitSignals: () => Promise<SignalSubmitResponse>;
  isSubmitting: boolean;
  lastResponse: SignalSubmitResponse | null;
};

export function useAntiMacro({
  page,
  collectors,
  getFingerprint,
}: UseAntiMacroOptions): UseAntiMacroReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastResponse, setLastResponse] = useState<SignalSubmitResponse | null>(null);
  const collectorsRef = useRef(collectors);
  collectorsRef.current = collectors;

  useEffect(() => {
    const current = collectorsRef.current;
    current.forEach((c) => c.start());
    return () => {
      current.forEach((c) => c.stop());
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getPayload = useCallback((): PageSignalPayload => {
    const allRaw = collectorsRef.current.map((c) => c.getRawData());

    // rawData 병합
    const rawData: PageSignalPayload['rawData'] = {};
    for (const raw of allRaw) {
      if (raw && typeof raw === 'object') {
        Object.assign(rawData, raw);
      }
    }

    return {
      page,
      collectedAt: Date.now(),
      fingerprint: getFingerprint?.() ?? undefined,
      rawData,
    };
  }, [page, getFingerprint]);

  const submitSignals = useCallback(async (): Promise<SignalSubmitResponse> => {
    setIsSubmitting(true);
    try {
      // fingerprintjs 등 비동기 collector 완료 대기
      await Promise.all(
        collectorsRef.current.map((c) =>
          'loadAsync' in c && typeof c.loadAsync === 'function'
            ? (c as { loadAsync(): Promise<void> }).loadAsync()
            : Promise.resolve(),
        ),
      );
      const payload = getPayload();
      const response = await submitSignalsService(payload);
      setLastResponse(response);
      return response;
    } finally {
      setIsSubmitting(false);
    }
  }, [getPayload]);

  return { getPayload, submitSignals, isSubmitting, lastResponse };
}
