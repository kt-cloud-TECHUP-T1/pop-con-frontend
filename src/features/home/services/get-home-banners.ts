import type { PopupSectionApiResponse, PopupSectionResponse } from '@/types/api/home';

const DEFAULT_LIMIT = 5;

export async function getHomeBanners(
  limit = DEFAULT_LIMIT,
  signal?: AbortSignal
): Promise<PopupSectionResponse | null> {
  try {
    const searchParams = new URLSearchParams({ limit: String(limit) });
    const response = await fetch(`/api/popups/banners?${searchParams.toString()}`, {
      method: 'GET',
      cache: 'no-store',
      signal,
    });

    const result = (await response.json()) as PopupSectionApiResponse;

    if (!response.ok || !result.data) {
      return null;
    }

    return result.data;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return null;
    }

    return null;
  }
}
