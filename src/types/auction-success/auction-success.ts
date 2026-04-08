// src/types/auction-reservation.ts
export interface AuctionReservationSuccessDetail {
  reservationNo: string;
  popupTitle: string;
  popupAddress: string;
  entryDate: string;
  entryTime: string;
  startPrice: number;
  discountAmount: number;
  finalPrice: number;
  paidAt: string;
}

export interface GetAuctionReservationSuccessResponse {
  status: 'SUCCESS';
  message: string;
  data: AuctionReservationSuccessDetail;
}

export type GetAuctionReservationErrorCode =
  | 'C001'
  | 'AU010'
  | 'A004'
  | 'AU006'
  | 'P003'
  | 'S001';

export interface GetAuctionReservationErrorResponse {
  code: GetAuctionReservationErrorCode;
  message: string;
  data: null;
}

export type GetAuctionReservationResponse =
  | GetAuctionReservationSuccessResponse
  | GetAuctionReservationErrorResponse;
