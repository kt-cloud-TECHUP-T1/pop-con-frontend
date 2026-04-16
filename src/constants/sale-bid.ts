export const AUCTION_BID_ERROR_MESSAGES = {
  C001: '입력값이 올바르지 않습니다.',
  AU007: '해당 회차는 매진되었습니다.',
  AU002: '현재 진행 중인 경매가 아닙니다.',
  AU006: '존재하지 않는 경매 옵션입니다.',
  P003: '결제 승인에 실패했습니다.',
  P002: '등록된 결제 수단이 없습니다.',
  S001: '시스템 오류가 발생했습니다.',
  AU011: '이미 해당 경매에 낙찰된 내역이 있습니다.',
} as const;

export type AuctionBidErrorCode = keyof typeof AUCTION_BID_ERROR_MESSAGES;
