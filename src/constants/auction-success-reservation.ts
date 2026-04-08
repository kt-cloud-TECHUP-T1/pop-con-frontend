// src/constants/auction-reservation.ts

import { GetAuctionReservationErrorCode } from '@/types/auction-success/auction-success';

export const AUCTION_RESERVATION_ERROR_MESSAGES: Record<
  GetAuctionReservationErrorCode,
  string
> = {
  C001: '입력값이 올바르지 않습니다.',
  AU010: '존재하지 않는 입찰 정보입니다.',
  A004: '접근 권한이 없습니다.',
  AU006: '존재하지 않는 경매 옵션입니다.',
  P003: '결제 승인에 실패했습니다.',
  S001: '시스템 오류가 발생했습니다.',
};

export const DEFAULT_AUCTION_RESERVATION_ERROR_MESSAGE =
  '예약 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.';
