import { COMMON_ERROR_MESSAGES } from '@/constants/error/common';
import { ApiError } from '@/lib/api-error';
import type { UserMeResponse, UserMeErrorResponse } from '../types/user-me';

export async function getUserMe(accessToken: string) {
  let response: Response;

  try {
    response = await fetch('/api/users/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
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

  let result: UserMeResponse | UserMeErrorResponse;

  try {
    result = (await response.json()) as UserMeResponse | UserMeErrorResponse;
  } catch {
    throw new ApiError({
      code: 'INVALID_JSON',
      message: COMMON_ERROR_MESSAGES.INVALID_JSON,
      status: response.status,
    });
  }

  if (result.code !== 'SUCCESS') {
    throw new ApiError({
      code: result.code,
      message: result.message ?? COMMON_ERROR_MESSAGES.UNKNOWN_ERROR,
      status: response.status,
    });
  }

  return (result as UserMeResponse).data;
}
