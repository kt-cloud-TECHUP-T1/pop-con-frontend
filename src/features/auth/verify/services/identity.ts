// auth/identity/complete api 호출
// 아직 재사용성 판단이 들지 않아 src/services에 두지 않음

import {
  AUTH_ERROR_CODES,
  AUTH_MESSAGES,
  AUTH_RESPONSE_CODE,
} from '@/constants/auth';
import { IdentityCompleteData } from '@/types/api/auth';
import { ApiResponse } from '@/types/api/common';

type IdentityCompleteResponse = ApiResponse<IdentityCompleteData>;

type CompleteIdentityResult =
  | { status: 'success'; data: IdentityCompleteData }
  | { status: 'under14'; message: string }
  | { status: 'sessionExpired'; message: string }
  | { status: 'failed'; message: string };

const COMPLETE_IDENTITY_ENDPOINT = '/api/auth/identity/complete';
const DEVICE_ID_HEADER = 'X-Device-Id';
const DEVICE_ID_STORAGE_KEY = 'deviceId';
const MISSING_RESPONSE_DATA_MESSAGE = '응답 데이터가 없습니다.';

// 클라이언트에 저장된 기기 식별자 조회 (없으면 null)
function getDeviceId() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(DEVICE_ID_STORAGE_KEY);
}

// 실패 응답 포맷을 공통으로 생성
function createFailedResult(
  message: string = AUTH_MESSAGES.COMMON.ERROR.SERVER_ERROR
): CompleteIdentityResult {
  return {
    status: 'failed',
    message,
  };
}

// 인증 완료 API 호출에 필요한 헤더 구성
function buildCompleteHeaders(deviceId: string | null) {
  return {
    'Content-Type': 'application/json',
    ...(deviceId ? { [DEVICE_ID_HEADER]: deviceId } : {}),
  };
}

// 백엔드 응답 코드를 앱에서 사용하는 상태값으로 변환
function parseCompleteResponse(
  res: Response,
  result: Partial<IdentityCompleteResponse>
): CompleteIdentityResult {
  if (result.code === AUTH_ERROR_CODES.JOIN.UNDERAGE) {
    return {
      status: 'under14',
      message: result.message ?? AUTH_MESSAGES.IDENTITY.ERROR.UNDERAGE,
    };
  }

  if (result.code === AUTH_ERROR_CODES.AUTH.SESSION_EXPIRED) {
    return {
      status: 'sessionExpired',
      message: result.message ?? AUTH_MESSAGES.TERMS.ERROR.SESSION_EXPIRED,
    };
  }

  if (!res.ok || result.code !== AUTH_RESPONSE_CODE.STATUS.SUCCESS) {
    return createFailedResult(result.message);
  }

  if (!result.data) {
    return createFailedResult(MISSING_RESPONSE_DATA_MESSAGE);
  }

  return {
    status: 'success',
    data: result.data,
  };
}

export async function completeIdentityVerification(
  identityVerificationId: string
): Promise<CompleteIdentityResult> {
  try {
    // 1) 디바이스 ID 포함 헤더로 인증 완료 API 요청
    const deviceId = getDeviceId();
    const res = await fetch(COMPLETE_IDENTITY_ENDPOINT, {
      method: 'POST',
      headers: buildCompleteHeaders(deviceId),
      body: JSON.stringify({ identityVerificationId }),
    });

    // 2) 응답 코드/데이터를 내부 결과 타입으로 정규화
    const result = (await res.json()) as Partial<IdentityCompleteResponse>;
    return parseCompleteResponse(res, result);
  } catch {
    // 3) 네트워크/런타임 예외는 공통 실패 메시지로 폴백
    return createFailedResult();
  }
}
