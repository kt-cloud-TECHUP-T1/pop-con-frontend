export const DRAW_ENTRY_ERROR_MESSAGE = {
  C001: '입력값이 올바르지 않습니다.',
  A002: '유효하지 않은 토큰입니다.',
  D002: '현재 진행 중인 드로우가 아닙니다.',
  D003: '이미 종료된 드로우입니다.',
  D005: '이미 해당 회차에 응모하셨습니다.',
  S001: '시스템 오류가 발생했습니다.',
} as const;

export type DrawEntryErrorCode = keyof typeof DRAW_ENTRY_ERROR_MESSAGE;
