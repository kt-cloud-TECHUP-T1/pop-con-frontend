import { COMMON_ERROR_MESSAGES } from './error/common';

export const POPUP_LIKE_ERROR_MESSAGES = {
  P001: '존재하지 않는 팝업입니다.',
  A003: '로그인이 만료되었습니다. 다시 로그인해주세요.',
} as const;

export function getPopupLikeErrorMessage(code: string) {
  return (
    POPUP_LIKE_ERROR_MESSAGES[code as keyof typeof POPUP_LIKE_ERROR_MESSAGES] ??
    COMMON_ERROR_MESSAGES[code as keyof typeof COMMON_ERROR_MESSAGES] ??
    COMMON_ERROR_MESSAGES.UNKNOWN_ERROR
  );
}

export const POPUP_UNLIKE_ERROR_MESSAGES = {
  P001: '존재하지 않는 팝업입니다.',
  A003: '인증이 만료되었습니다. 다시 로그인해주세요.',
} as const;

export function getPopupUnlikeErrorMessage(code: string) {
  return (
    POPUP_UNLIKE_ERROR_MESSAGES[
      code as keyof typeof POPUP_UNLIKE_ERROR_MESSAGES
    ] ??
    COMMON_ERROR_MESSAGES[code as keyof typeof COMMON_ERROR_MESSAGES] ??
    COMMON_ERROR_MESSAGES.UNKNOWN_ERROR
  );
}
