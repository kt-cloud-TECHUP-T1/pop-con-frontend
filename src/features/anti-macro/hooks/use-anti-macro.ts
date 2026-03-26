'use client';

import { useEffect, useRef, useCallback } from 'react';
import type {
  PageType,
  PageSignalPayload,
  SignalCollector,
} from '../types';
import { submitSignals as submitSignalsService } from '../services/submit-signals';

type UseAntiMacroOptions = {
  page: PageType;
  collectors: SignalCollector[];
  /** 핑거프린트 collector에서 가져올 때 사용 */
  getFingerprint?: () => import('../types').BrowserFingerprint | null;
  /** visitorId를 동적으로 가져오는 함수 (submit 시점에 호출) */
  getVisitorId?: () => string | undefined;
  /** userId (로그인 후 사용) */
  userId?: string;
};

type UseAntiMacroReturn = {
  getPayload: () => PageSignalPayload;
  /** fire-and-forget 시그널 전송 */
  submitSignals: () => void;
};

export function useAntiMacro({
  page,
  collectors,
  getFingerprint,
  getVisitorId,
  userId,
}: UseAntiMacroOptions): UseAntiMacroReturn {
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

  const submitSignals = useCallback((): void => {
    void (async () => {
      try {
        // 비동기 collector 완료 대기 (일부 실패해도 나머지 데이터는 전송)
        await Promise.allSettled(
          collectorsRef.current.map((c) =>
            'loadAsync' in c && typeof c.loadAsync === 'function'
              ? (c as { loadAsync(): Promise<void> }).loadAsync()
              : Promise.resolve(),
          ),
        );
        const payload = getPayload();
        const visitorId = getVisitorId?.();
        submitSignalsService(payload, { visitorId, userId });
      } catch {
        // 시그널 수집 실패는 UX 영향 없이 무시
      }
    })();
  }, [getPayload, getVisitorId, userId]);

  return { getPayload, submitSignals };
}
