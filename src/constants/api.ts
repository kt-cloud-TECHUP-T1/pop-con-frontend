export const API_MESSAGES = {
  COMMON: {
    INVALID_INPUT: '입력값이 올바르지 않습니다.',
    SERVER_ERROR: '처리 중 오류가 발생했습니다. 다시 시도해주세요.',
  },
} as const;

export const API_ERROR_CODES = {
  COMMON: {
    BAD_REQUEST: 'C001',
  },
  SYSTEM: {
    INTERNAL_SERVER_ERROR: 'S001',
  },
} as const;

export const API_RESPONSE_CODE = {
  STATUS: {
    SUCCESS: 'SUCCESS',
  },
} as const;
