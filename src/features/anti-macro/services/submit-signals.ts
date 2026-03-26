import type { PageSignalPayload } from '../types';
import { ANTI_MACRO_API_BASE } from '../constants';

type SubmitOptions = {
  visitorId?: string;
  userId?: string;
};

/**
 * fire-and-forget 시그널 전송
 * Next.js 프록시를 거치므로 서버가 백엔드 전달 보장
 */
export function submitSignals(
  payload: PageSignalPayload,
  options: SubmitOptions = {},
): void {
  const submission = {
    timestamp: Date.now(),
    payload,
    ...(options.visitorId && { visitorId: options.visitorId }),
    ...(options.userId && { userId: options.userId }),
  };

  fetch(`${ANTI_MACRO_API_BASE}/signals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(submission),
  }).catch(() => {
    // 실패해도 무시 (사일런트)
  });
}
