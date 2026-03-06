// portone SDK 호출 래퍼

import * as PortOne from '@portone/browser-sdk/v2';

type PortoneVerifyResult =
  | { status: 'success'; identityVerificationId: string }
  | { status: 'cancelled'; message?: string }
  | { status: 'failed'; message: string };

const storeId = process.env.NEXT_PUBLIC_PORTONE_STORE_ID;
const channelKey = process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY;

export async function requestPortoneIdentityVerification(): Promise<PortoneVerifyResult> {
  try {
    if (!storeId || !channelKey) {
      return {
        status: 'failed',
        message: 'Portone 환경변수가 설정되지 않았습니다.',
      };
    }

    const response = await PortOne.requestIdentityVerification({
      storeId,
      identityVerificationId: `identity-verification-${crypto.randomUUID()}`,
      channelKey,
    });

    if (response?.code !== undefined) {
      const message = response.message ?? '본인인증에 실패했습니다.';
      return { status: 'failed', message };
    }

    if (!response?.identityVerificationId) {
      return { status: 'failed', message: '본인인증 식별자가 없습니다.' };
    }

    return {
      status: 'success',
      identityVerificationId: response.identityVerificationId,
    };
  } catch (error) {
    if (PortOne.isIdentityVerificationError(error)) {
      if (error.code === PortOne.GrpcErrorCode.Cancelled) {
        return { status: 'cancelled', message: error.message };
      }

      return {
        status: 'failed',
        message: error.message || '본인인증에 실패했습니다.',
      };
    }

    return {
      status: 'failed',
      message: '인증 모듈 오류가 발생했습니다. 다시 시도해주세요.',
    };
  }
}
