import { COMMON_ERROR_MESSAGES } from '@/constants/error/common';
import { getPopupLikeErrorMessage } from '@/constants/popup-liked';
import { ApiError } from '@/lib/api-error';
import type {
  PopupLikeErrorResponse,
  PopupLikeResponse,
} from '@/types/popup/popup-like';

export async function postPopupLike(
  popupId: number,
  accessToken: string
): Promise<PopupLikeResponse> {
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
      method: 'POST',
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

  let result: PopupLikeResponse | PopupLikeErrorResponse;

  try {
    result = (await response.json()) as
      | PopupLikeResponse
      | PopupLikeErrorResponse;
  } catch {
    throw new ApiError({
      code: 'INVALID_JSON',
      message: COMMON_ERROR_MESSAGES.INVALID_JSON,
      status: response.status,
    });
  }

  if (result.code !== 'SUCCESS') {
    const errorResult = result as PopupLikeErrorResponse;

    throw new ApiError({
      code: errorResult.code,
      message: getPopupLikeErrorMessage(errorResult.code),
      status: response.status,
    });
  }

  return result as PopupLikeResponse;
}
