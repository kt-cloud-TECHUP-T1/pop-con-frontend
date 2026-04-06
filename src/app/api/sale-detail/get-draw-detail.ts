// src/app/api/sale-detail/get-draw-detail.ts

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, '');

export interface DrawDetailResponse {
  code: string;
  message: string;
  data: {
    drawOpenAt: string;
    drawCloseAt: string;
    serverTime: string;
    drawId: number;
  } | null;
}

export interface DrawDetailErrorResponse {
  code: string;
  message: string;
  data: Record<string, string> | null;
}

export async function getDrawDetail(drawId: string | number) {
  if (!BASE_URL) {
    throw new Error('NEXT_PUBLIC_API_BASE_URL이 설정되지 않았습니다.');
  }

  const response = await fetch(`${BASE_URL}/draws/${drawId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    let errorData: DrawDetailErrorResponse | null = null;

    try {
      errorData = await response.json();
    } catch {
      throw new Error(`드로우 상세 조회 실패: ${response.status}`);
    }

    throw new Error(
      errorData?.message ?? `드로우 상세 조회 실패: ${response.status}`
    );
  }

  const result: DrawDetailResponse = await response.json();

  if (result.code !== 'SUCCESS' || !result.data) {
    throw new Error(result.message ?? '드로우 상세 조회에 실패했습니다.');
  }

  return result.data;
}
