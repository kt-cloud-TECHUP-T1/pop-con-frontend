'use server';

import { getServiceBaseUrl } from '@/app/api/shared/route-helpers';
import {
  PROFILE_ERROR_CODES,
  PROFILE_MESSAGES,
} from '@/features/user/constants/profile';
import type { UpdateProfileResponse } from '@/features/user/types/profile';

const API_BASE_URL = getServiceBaseUrl('user');

export async function updateMyProfileAction(
  accessToken: string | null,
  formData: FormData
): Promise<UpdateProfileResponse> {
  if (!accessToken) {
    return {
      code: PROFILE_ERROR_CODES.AUTH.INVALID_TOKEN,
      message: PROFILE_MESSAGES.ERROR.INVALID_TOKEN,
      data: null,
    };
  }

  if (!API_BASE_URL) {
    return {
      code: PROFILE_ERROR_CODES.SYSTEM.ERROR,
      message: PROFILE_MESSAGES.ERROR.SYSTEM,
      data: null,
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/users/me/profile`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
      cache: 'no-store',
    });

    return (await response.json()) as UpdateProfileResponse;
  } catch (error) {
    console.error('[updateMyProfileAction]', error);

    return {
      code: PROFILE_ERROR_CODES.SYSTEM.ERROR,
      message: PROFILE_MESSAGES.ERROR.SYSTEM,
      data: null,
    };
  }
}
