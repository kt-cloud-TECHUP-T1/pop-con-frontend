import {
  PopupDetailErrorResponse,
  PopupDetailResponse,
} from '@/types/sale-detail';
import { getServiceBaseUrl } from '../shared/route-helpers';

export async function getPopupDetail(popupId: number, accessToken?: string) {
  const API_BASE_URL = getServiceBaseUrl('auction');

  if (!API_BASE_URL) {
    throw new Error('NEXT_PUBLIC_API_BASE_URL이 설정되지 않았습니다.');
  }

  const url = `${API_BASE_URL}/popups/${popupId}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    let errorData: PopupDetailErrorResponse | null = null;

    try {
      errorData = await response.json();
    } catch {
      throw new Error(`팝업 상세 조회 실패: ${response.status}`);
    }

    throw new Error(
      errorData?.message ?? `팝업 상세 조회 실패: ${response.status}`
    );
  }

  const result: PopupDetailResponse = await response.json();
  return result.data;
}
