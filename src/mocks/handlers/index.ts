import { auctionReservationHandlers } from './auction-success/auction-reservation';
import { authHandlers } from './auth';
import { billingMyHandlers } from './billing/get-billingList';
import { billingKeyHandlers } from './billing/set-billing-keys';
import { drawEntryHandlers } from './draw-success/draw-entry';
import { auctionQueueHandlers } from './queue/auction-queue';
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
  ...billingKeyHandlers,
  ...billingMyHandlers,
  ...auctionQueueHandlers,
  ...auctionReservationHandlers,
  ...drawEntryHandlers,
  ...queueHandlers,
];
