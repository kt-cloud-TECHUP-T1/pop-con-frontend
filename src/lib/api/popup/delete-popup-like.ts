import { COMMON_ERROR_MESSAGES } from '@/constants/error/common';
import { getPopupUnlikeErrorMessage } from '@/constants/popup-liked';
import { ApiError } from '@/lib/api-error';
import {
  PopupUnlikeErrorResponse,
  PopupUnlikeResponse,
} from '@/types/popup-like';

export async function deletePopupLike(
  popupId: number,
  accessToken: string
): Promise<PopupUnlikeResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '');

  if (!baseUrl) {
    throw new ApiError({
      code: 'UNKNOWN_ERROR',
      message: 'API 기본 URL이 설정되지 않았습니다.',
    });
  }

  const url = `${baseUrl}/popups/${popupId}/likes`;

  let response: Response;

  try {
    response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });
  } catch {
    throw new ApiError({
      code: 'NETWORK_ERROR',
      message: COMMON_ERROR_MESSAGES.NETWORK_ERROR,
    });
  }

  let result: PopupUnlikeResponse | PopupUnlikeErrorResponse;

  try {
    result = (await response.json()) as
      | PopupUnlikeResponse
      | PopupUnlikeErrorResponse;
  } catch {
    throw new ApiError({
      code: 'INVALID_JSON',
      message: COMMON_ERROR_MESSAGES.INVALID_JSON,
      status: response.status,
    });
  }

  if (result.code !== 'SUCCESS') {
    const errorResult = result as PopupUnlikeErrorResponse;

    throw new ApiError({
      code: errorResult.code,
      message: getPopupUnlikeErrorMessage(errorResult.code),
      status: response.status,
      data: errorResult,
    });
  }

  return result as PopupUnlikeResponse;
}
