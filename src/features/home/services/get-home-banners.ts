import type {
  PopupSectionApiResponse,
  PopupSectionResponse,
} from '@/types/api/home';

const DEFAULT_LIMIT = 5;

export async function getHomeBanners(
  limit = DEFAULT_LIMIT,
  signal?: AbortSignal
): Promise<PopupSectionResponse | null> {
  try {
    const response = await fetch(`/api/popups/banners?limit=${limit}`, {
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
    if (process.env.NODE_ENV === 'development') {
      console.error(
        '[getHomeBanners] 배너 데이터를 불러오지 못했습니다.',
        error
      );
    }

    return null;
  }
}
