import type { PageSignalPayload } from '../types';
import { ANTI_MACRO_API_BASE } from '../constants';

type SubmitOptions = {
  visitorId?: string;
  userId?: string;
};

/**
 * 시그널 전송 (프록시 경유)
 * 프록시 서버에 도달하면 백엔드 전달은 서버가 보장
 */
export async function submitSignals(
  payload: PageSignalPayload,
  options: SubmitOptions = {},
): Promise<void> {
  const submission = {
    timestamp: Date.now(),
    payload,
    ...(options.visitorId && { visitorId: options.visitorId }),
    ...(options.userId && { userId: options.userId }),
  };

  try {
    await fetch(`${ANTI_MACRO_API_BASE}/signals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submission),
    });
  } catch {
    // 실패해도 무시 (사일런트)
  }
}
