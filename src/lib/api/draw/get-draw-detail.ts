import { DRAW_ERROR_MESSAGES } from '@/constants/draw';
import { COMMON_ERROR_MESSAGES } from '@/constants/error/common';
import { ApiError } from '@/lib/api-error';
import {
  DrawDetailResponse,
  DrawErrorResponse,
} from '@/types/popup/sale-detail';

export async function getDrawDetail(drawId: string | number) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '');

  if (!baseUrl) {
    throw new ApiError({
      code: 'UNKNOWN_ERROR',
      message: 'API 기본 URL이 설정되지 않았습니다.',
    });
  }

  const url = `${baseUrl}/draws/${drawId}`;

  let response: Response;

  // 1. 네트워크 에러
  try {
    response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
  } catch {
    throw new ApiError({
      code: 'NETWORK_ERROR',
      message: COMMON_ERROR_MESSAGES.NETWORK_ERROR,
    });
  }

  //2. json 파싱에러

  let result: DrawDetailResponse | DrawErrorResponse;

  try {
    result = (await response.json()) as DrawDetailResponse | DrawErrorResponse;
  } catch {
    throw new ApiError({
      code: 'INVALID_JSON',
      message: COMMON_ERROR_MESSAGES.INVALID_JSON,
      status: response.status,
    });
  }

  //3 비즈니스 에러

  if (result.code !== 'SUCCESS') {
    const errorResult = result as DrawErrorResponse;

    throw new ApiError({
      code: errorResult.code,
      message:
        DRAW_ERROR_MESSAGES[
          errorResult.code as keyof typeof DRAW_ERROR_MESSAGES
        ] ??
        COMMON_ERROR_MESSAGES[
          errorResult.code as keyof typeof COMMON_ERROR_MESSAGES
        ] ??
        errorResult.message ??
        COMMON_ERROR_MESSAGES.UNKNOWN_ERROR,
      status: response.status,
      data: errorResult.data,
    });
  }
  const successResult = result as DrawDetailResponse;
  return successResult.data;
}
