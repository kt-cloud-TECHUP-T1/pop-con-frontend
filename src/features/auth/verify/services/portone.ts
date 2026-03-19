// portone SDK 호출 래퍼

import * as PortOne from '@portone/browser-sdk/v2';
import { AUTH_MESSAGES } from '@/constants/auth';

type PortoneVerifyResult =
  | { status: 'success'; identityVerificationId: string }
  | { status: 'cancelled'; message?: string }
  | { status: 'failed'; message: string };

const storeId = process.env.NEXT_PUBLIC_PORTONE_STORE_ID;
const channelKey = process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY;

// 포트원 호출에 필요한 공개 환경변수가 모두 있는지 확인
function getPortoneConfig() {
  if (!storeId || !channelKey) return null;
  return { storeId, channelKey };
}

// 포트원 본인인증 요청별 고유 식별자 생성
function createIdentityVerificationId() {
  const uniqueId =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  return `identity-verification-${uniqueId}`;
}

// SDK 응답을 앱에서 사용하는 결과 타입으로 정규화
function parseVerificationResponse(
  response: Awaited<ReturnType<typeof PortOne.requestIdentityVerification>>
): PortoneVerifyResult {
  if (response?.code !== undefined) {
    return {
      status: 'failed',
      message: response.message ?? AUTH_MESSAGES.IDENTITY.ERROR.VERIFY_FAILED,
    };
  }

  if (!response?.identityVerificationId) {
    return {
      status: 'failed',
      message: AUTH_MESSAGES.IDENTITY.ERROR.REQUIRED_ID,
    };
  }

  return {
    status: 'success',
    identityVerificationId: response.identityVerificationId,
  };
}

export async function requestPortoneIdentityVerification(): Promise<PortoneVerifyResult> {
  try {
    // 1) 필수 환경변수 확인
    const config = getPortoneConfig();
    if (!config) {
      return {
        status: 'failed',
        message: AUTH_MESSAGES.IDENTITY.ERROR.MISSING_CONFIG,
      };
    }

    // 2) 포트원 인증창 호출 후 결과를 공통 타입으로 변환
    const response = await PortOne.requestIdentityVerification({
      storeId: config.storeId,
      identityVerificationId: createIdentityVerificationId(),
      channelKey: config.channelKey,
    });
    return parseVerificationResponse(response);
  } catch (error) {
    // 3) SDK가 던진 도메인 에러는 취소/실패로 분기
    if (PortOne.isIdentityVerificationError(error)) {
      if (error.code === PortOne.GrpcErrorCode.Cancelled) {
        return { status: 'cancelled', message: error.message };
      }

      return {
        status: 'failed',
        message: error.message ?? AUTH_MESSAGES.IDENTITY.ERROR.VERIFY_FAILED,
      };
    }

    // 4) 그 외 예외는 모듈 오류로 통일
    return {
      status: 'failed',
      message: AUTH_MESSAGES.IDENTITY.ERROR.MODULE_ERROR,
    };
  }
}
