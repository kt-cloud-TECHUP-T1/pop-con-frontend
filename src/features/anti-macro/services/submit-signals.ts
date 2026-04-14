import type { PageSignalPayload } from '../types';
import { ANTI_MACRO_API_BASE } from '../constants';

type SubmitOptions = {
  visitorId?: string;
  userId?: string;
};

async function gzip(text: string): Promise<Blob | null> {
  if (typeof CompressionStream === 'undefined') return null;
  try {
    const stream = new Blob([text]).stream().pipeThrough(new CompressionStream('gzip'));
    return await new Response(stream).blob();
  } catch {
    return null;
  }
}

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
    ...(options.visitorId && { visitorId: String(options.visitorId) }),
    ...(options.userId && { userId: String(options.userId) }),
  };

  const json = JSON.stringify(submission);
  const compressed = await gzip(json);

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  let body: BodyInit = json;
  if (compressed) {
    headers['Content-Encoding'] = 'gzip';
    body = compressed;
  }

  try {
    await fetch(`${ANTI_MACRO_API_BASE}/signals`, {
      method: 'POST',
      headers,
      body,
    });
  } catch {
    // 실패해도 무시 (사일런트)
  }
}
