import { AuctionBidErrorCode } from '@/constants/sale-bid';

export type AuctionBidRequest = {
  auctionOptionId: number;
  bidPrice: number;
};

export type AuctionBidSuccessData = {
  bidId: number;
  status: 'SUCCESS';
  message: string;
  reservationNo: string;
};

export type AuctionBidValidationErrorData = {
  auctionOptionId?: string;
  bidPrice?: string;
};

export type AuctionBidResult =
  | {
      code: 'SUCCESS';
      message: string;
      data: AuctionBidSuccessData;
    }
  | {
      code: 'C001';
      message: string;
      data: AuctionBidValidationErrorData;
    }
  | {
      code: Exclude<AuctionBidErrorCode, 'C001'>;
      message: string;
      data: null;
    };
