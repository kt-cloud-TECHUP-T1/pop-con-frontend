// auth/identity/complete api 호출
// 아직 재사용성 판단이 들지 않아 src/services에 두지 않음

import { AUTH_MESSAGES } from '@/constants/auth';
import { IdentityCompleteData } from '@/types/api/auth';
import { ApiResponse } from '@/types/api/common';

type IdentityCompleteResponse = ApiResponse<IdentityCompleteData>;

type CompleteIdentityResult =
  | { status: 'success'; data: IdentityCompleteData }
  | { status: 'under14'; message: string }
  | { status: 'failed'; message: string };

export async function completeIdentityVertification(
  identityVerificationId: string,
  registerToken: string
): Promise<CompleteIdentityResult> {
  const res = await fetch('/api/auth/identity/complete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
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
}
