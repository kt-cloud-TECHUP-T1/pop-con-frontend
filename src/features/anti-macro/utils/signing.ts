import type { PageSignalPayload } from '../types';

/**
 * HMAC-SHA256 서명 생성.
 * Web Crypto API 사용 (HTTPS 필요).
 * dev 환경(localhost)에서는 crypto.subtle이 사용 가능하므로 정상 동작.
 */
export async function signPayload(
  payload: PageSignalPayload,
  nonce: string,
  challenge?: string,
): Promise<string> {
  const encoder = new TextEncoder();
  const data = JSON.stringify(payload) + nonce;
  const keyMaterial = challenge || nonce;

  // crypto.subtle이 없는 환경(HTTP 비보안 컨텍스트) fallback
  if (!crypto.subtle) {
    return fallbackHash(data + keyMaterial);
  }

  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(keyMaterial),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );

  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  return arrayBufferToHex(sig);
}

function arrayBufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** 비보안 컨텍스트 fallback (개발용) */
function fallbackHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}
