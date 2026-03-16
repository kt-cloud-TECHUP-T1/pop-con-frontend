import {
  AUTH_ERROR_CODES,
  AUTH_MESSAGES,
} from '@/constants/auth';
import {
  API_ERROR_CODES,
  API_MESSAGES,
  API_RESPONSE_CODE,
} from '@/constants/api';
import { ApiResponse } from '@/types/api/common';
import { SignupCompleteData, SignupRequest } from '@/types/api/auth';

type SignupResponse = ApiResponse<SignupCompleteData>;

type SignupResult =
  | { status: 'success'; data: SignupCompleteData }
  | { status: 'invalidInput'; message: string; data: Record<string, string> | null }
  | { status: 'alreadyJoined'; message: string }
  | { status: 'sessionExpired'; message: string }
  | { status: 'invalidAuth'; message: string }
  | { status: 'missingSocialInfo'; message: string }
  | { status: 'failed'; message: string };

const SIGNUP_ENDPOINT = '/api/auth/signup';
const DEVICE_ID_HEADER = 'X-Device-Id';
const DEVICE_ID_STORAGE_KEY = 'deviceId';
const MISSING_RESPONSE_DATA_MESSAGE = '응답 데이터가 없습니다.';

function getDeviceId() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(DEVICE_ID_STORAGE_KEY);
}

function buildHeaders(deviceId: string | null) {
  return {
    'Content-Type': 'application/json',
    ...(deviceId ? { [DEVICE_ID_HEADER]: deviceId } : {}),
  };
}

function createFailedResult(
  message: string = API_MESSAGES.COMMON.SERVER_ERROR
): SignupResult {
  return {
    status: 'failed',
    message,
  };
}

function parseSignupResponse(
  res: Response,
  result: Partial<SignupResponse>
): SignupResult {
  if (result.code === API_ERROR_CODES.COMMON.BAD_REQUEST) {
    return {
      status: 'invalidInput',
      message: result.message ?? AUTH_MESSAGES.IDENTITY.ERROR.INVALID_INPUT,
      data: (result.data as Record<string, string> | null) ?? null,
    };
  }

  if (result.code === AUTH_ERROR_CODES.JOIN.ALREADY_COMPLETED) {
    return {
      status: 'alreadyJoined',
      message: result.message ?? AUTH_MESSAGES.TERMS.ERROR.ALREADY_REGISTERED,
    };
  }

  if (result.code === AUTH_ERROR_CODES.AUTH.SESSION_EXPIRED) {
    return {
      status: 'sessionExpired',
      message: result.message ?? AUTH_MESSAGES.TERMS.ERROR.SESSION_EXPIRED,
    };
  }

  if (result.code === AUTH_ERROR_CODES.AUTH.INVALID_AUTH) {
    return {
      status: 'invalidAuth',
      message: result.message ?? AUTH_MESSAGES.IDENTITY.ERROR.INVALID_AUTH,
    };
  }

  if (result.code === AUTH_ERROR_CODES.USER.MISSING_SOCIAL_INFO) {
    return {
      status: 'missingSocialInfo',
      message: result.message ?? '가입 세션의 소셜 정보가 누락되었습니다.',
    };
  }

  if (!res.ok || result.code !== API_RESPONSE_CODE.STATUS.SUCCESS) {
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

export async function signupWithAgreements(
  requestBody: SignupRequest
): Promise<SignupResult> {
  try {
    const deviceId = getDeviceId();
    const res = await fetch(SIGNUP_ENDPOINT, {
      method: 'POST',
      headers: buildHeaders(deviceId),
      body: JSON.stringify(requestBody),
    });

    const result = (await res.json()) as Partial<SignupResponse>;
    return parseSignupResponse(res, result);
  } catch {
    return createFailedResult();
  }
}
