import { PopupDetailResponse } from '@/types/sale-detail';

interface GetPopupDetailParams {
  popupId: string;
  accessToken?: string;
}

export async function getPopupDetail({
  popupId,
  accessToken,
}: GetPopupDetailParams) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/popups/${popupId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    throw new Error(`팝업 상세 조회 실패: ${response.status}`);
  }

  const result: PopupDetailResponse = await response.json();

  if (result.code !== 'SUCCESS') {
    throw new Error(result.message || '팝업 상세 조회 실패');
  }

  return result.data;
}
