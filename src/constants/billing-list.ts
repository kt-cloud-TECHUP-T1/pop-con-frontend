export const BILLING_ERROR_MESSAGES = {
  U001: '존재하지 않는 사용자입니다.',
  A002: '유효하지 않은 토큰입니다.',
  A003: '인증이 만료되었습니다. 다시 로그인해주세요.',
} as const;

export type BillingErrorCode = keyof typeof BILLING_ERROR_MESSAGES;
