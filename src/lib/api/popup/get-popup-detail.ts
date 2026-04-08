import { COMMON_ERROR_MESSAGES } from '@/constants/error/common';
import { ApiError } from '@/lib/api-error';
import {
  PopupDetailErrorResponse,
  PopupDetailResponse,
} from '@/types/sale-detail';

export async function getPopupDetail(popupId: number, accessToken?: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '');

  if (!baseUrl) {
    throw new ApiError({
      code: 'UNKNOWN_ERROR',
      message: 'API 기본 URL이 설정되지 않았습니다.',
    });
  }

  const url = `${baseUrl}/popups/${popupId}`;

  let response: Response;

  try {
    response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      cache: 'no-store',
    });
  } catch {
    throw new ApiError({
      code: 'NETWORK_ERROR',
      message: COMMON_ERROR_MESSAGES.NETWORK_ERROR,
    });
  }

  let result: PopupDetailResponse | PopupDetailErrorResponse;

  try {
    result = (await response.json()) as
      | PopupDetailResponse
      | PopupDetailErrorResponse;
  } catch {
    throw new ApiError({
      code: 'INVALID_JSON',
      message: COMMON_ERROR_MESSAGES.INVALID_JSON,
      status: response.status,
    });
  }

  if (result.code !== 'SUCCESS') {
    const errorResult = result as PopupDetailErrorResponse;

    throw new ApiError({
      code: errorResult.code,
      message:
        COMMON_ERROR_MESSAGES[
          errorResult.code as keyof typeof COMMON_ERROR_MESSAGES
        ] ??
        errorResult.message ??
        COMMON_ERROR_MESSAGES.UNKNOWN_ERROR,
      status: response.status,
      data: errorResult.data,
    });
  }

  const successResult = result as PopupDetailResponse;

  return successResult.data;
}
