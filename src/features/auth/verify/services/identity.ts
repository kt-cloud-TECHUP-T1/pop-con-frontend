// auth/identity/complete api 호출
// 아직 재사용성 판단이 들지 않아 src/services에 두지 않음

import { AUTH_MESSAGES } from '@/constants/auth';
import { IdentityCompleteData } from '@/types/api/auth';
import { ApiResponse } from '@/types/api/common';

type IdentityCompleteResponse = ApiResponse<IdentityCompleteData>;

type CompleteIdentityResult =
  | { status: 'success'; data: IdentityCompleteData }
  | { status: 'under14'; message: string }
  | { status: 'sessionExpired'; message: string }
  | { status: 'failed'; message: string };

const DEVICE_ID_HEADER = 'X-Device-Id';
const DEVICE_ID_STORAGE_KEY = 'deviceId';

function getDeviceId() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(DEVICE_ID_STORAGE_KEY);
}

export async function completeIdentityVertification(
  identityVerificationId: string,
  registerToken: string
): Promise<CompleteIdentityResult> {
  try {
    const deviceId = getDeviceId();
    const res = await fetch('/api/auth/identity/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(deviceId ? { [DEVICE_ID_HEADER]: deviceId } : {}),
      },
      body: JSON.stringify({ identityVerificationId, registerToken }),
    });

    const result = (await res.json()) as Partial<IdentityCompleteResponse>;

    if (result.code === 'J001') {
      return {
        status: 'under14',
        message: result.message ?? AUTH_MESSAGES.IDENTITY.ERROR.UNDERAGE,
      };
    }

    if (result.code === 'A001') {
      return {
        status: 'sessionExpired',
        message:
          result.message ?? '회원가입 세션이 만료되었습니다. 다시 가입 절차를 진행해주세요.',
      };
    }

    if (!res.ok || result.code !== 'SUCCESS') {
      return {
        status: 'failed',
        message: result.message ?? '본인인증 처리 중 오류가 발생했습니다.',
      };
    }

    if (!result.data) {
      return {
        status: 'failed',
        message: '응답 데이터가 없습니다.',
      };
    }

    return {
      status: 'success',
      data: result.data,
    };
  } catch {
    return {
      status: 'failed',
      message: '본인인증 처리 중 오류가 발생했습니다.',
    };
  }
}
