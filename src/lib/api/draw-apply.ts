import { DrawEntryRequest, DrawEntryResult } from '@/types/applay/draw-apply';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? '').replace(/\/+$/, '');

export async function postDrawEntry(
  drawId: number,
  optionId: number,
  body: DrawEntryRequest,
  accessToken: string,
  quizPassedToken: string
): Promise<DrawEntryResult> {
  const response = await fetch(
    `${API_BASE_URL}/draws/${drawId}/options/${optionId}/entries`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'X-Quiz-Passed-Token': quizPassedToken,
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    }
  );

  const result: DrawEntryResult = await response.json();

  return result;
}
