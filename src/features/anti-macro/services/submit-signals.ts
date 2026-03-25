import type { AntiMacroSubmission, PageSignalPayload, SignalSubmitResponse } from '../types';
import { fetchNonce } from './nonce';
import { signPayload } from '../utils/signing';

export async function submitSignals(
  payload: PageSignalPayload,
): Promise<SignalSubmitResponse> {
  const { nonce, challenge } = await fetchNonce();
  const signature = await signPayload(payload, nonce, challenge);
  const deviceId = localStorage.getItem('deviceId') ?? '';

  const submission: AntiMacroSubmission = {
    nonce,
    timestamp: Date.now(),
    payload,
    signature,
    deviceId,
  };

  const res = await fetch('/api/anti-macro/signals', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Device-Id': deviceId,
    },
    body: JSON.stringify(submission),
  });

  if (!res.ok) {
    throw new Error(`Failed to submit signals: ${res.status}`);
  }

  return res.json();
}
