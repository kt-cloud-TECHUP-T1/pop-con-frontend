import { authHandlers } from './auth';
import { auctionHandlers } from './sale-detail/auction';
import { auctionStreamHandlers } from './sale-detail/auction-stream';
import { popupDetailHandlers } from './sale-detail/popup-detail';

export const handlers = [
  ...authHandlers,
  ...popupDetailHandlers,
  ...auctionHandlers,
  ...auctionStreamHandlers,
];
