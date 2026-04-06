import { authHandlers } from './auth';
import { auctionHandlers } from './sale-detail/auction';
import { auctionStreamHandlers } from './sale-detail/auction-stream';
import { drawHandlers } from './sale-detail/draw';
import { popupDetailHandlers } from './sale-detail/popup-detail';
import { queueHandlers } from './queue';

export const handlers = [
  ...authHandlers,
  ...popupDetailHandlers,
  ...auctionHandlers,
  ...auctionStreamHandlers,
  ...drawHandlers,
  ...queueHandlers,
];
