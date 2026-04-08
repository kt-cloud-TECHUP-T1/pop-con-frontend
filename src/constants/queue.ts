export const QUEUE_ERROR_MESSAGES = {
  C001: '잘못된 요청입니다.',
  A002: '유효하지 않은 토큰입니다.',
  A003: '인증이 만료되었습니다. 다시 로그인해주세요.',
  Q001: '정책 위반으로 접근이 제한되었습니다.',
  S001: '시스템 오류가 발생했습니다.',
  Q002: '대기열 토큰이 필요합니다.',
  Q003: '유효하지 않은 대기열 토큰입니다.',
} as const;

export const QUEUE_ERROR_CODES = {
  INVALID_INPUT: 'C001',
  INVALID_TOKEN: 'A002',
  EXPIRED_TOKEN: 'A003',
  BLOCKED: 'Q001',
  SERVER_ERROR: 'S001',
  QUEUE_TOKEN_REQUIRED: 'Q002',
  INVALID_QUEUE_TOKEN: 'Q003',
} as const;
