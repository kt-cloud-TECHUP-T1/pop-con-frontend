import type { NonceResponse } from '../types';

export async function fetchNonce(): Promise<NonceResponse> {
  const res = await fetch('/api/anti-macro/nonce');

  if (!res.ok) {
    throw new Error(`Failed to fetch nonce: ${res.status}`);
  }

  return res.json();
}
