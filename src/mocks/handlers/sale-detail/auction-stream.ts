// src/mocks/handlers/auction-stream.ts
import { sse } from 'msw';
import type { AuctionData } from '@/types/sale-detail';

function createAuctionPayload(seconds: number): AuctionData {
  const startPrice = 100000;
  const minimumPrice = 30000;
  const priceDropUnit = 1000;
  const priceDropIntervalSeconds = 10;

  const droppedCount = Math.floor(seconds / priceDropIntervalSeconds);
  const currentPrice = Math.max(
    startPrice - droppedCount * priceDropUnit,
    minimumPrice
  );

  const nextPrice = Math.max(currentPrice - priceDropUnit, minimumPrice);

  const remainingUntilCloseSeconds = Math.max(578 - seconds, 0);

  const secondsUntilNextDrop =
    currentPrice === minimumPrice
      ? 0
      : priceDropIntervalSeconds -
        (seconds % priceDropIntervalSeconds || priceDropIntervalSeconds);

  return {
    auctionId: 100,
    auctionStatus: remainingUntilCloseSeconds > 0 ? 'OPEN' : 'CLOSED',
    serverTime: new Date().toISOString(),
    auctionOpenAt: '2026-03-11T14:48:13',
    auctionCloseAt: '2026-03-11T14:58:53',
    remainingUntilOpenSeconds: 0,
    remainingUntilCloseSeconds,
    startPrice,
    minimumPrice,
    currentPrice,
    nextPrice: currentPrice === minimumPrice ? minimumPrice : nextPrice,
    discountAmount: startPrice - currentPrice,
    priceDropUnit,
    priceDropIntervalSeconds,
    secondsUntilNextDrop:
      remainingUntilCloseSeconds > 0 ? secondsUntilNextDrop : 0,
    maxPurchaseQuantityPerRound: 10,
    canParticipate: remainingUntilCloseSeconds > 0,
    buttonStatus: remainingUntilCloseSeconds > 0 ? 'ENABLED' : 'ENDED',
  };
}

export const auctionStreamHandlers = [
  sse<{
    'auction-price': AuctionData;
    ping: string;
  }>('*/auctions/:auctionId/stream', ({ params, client }) => {
    const auctionId = Number(params.auctionId);

    if (!Number.isInteger(auctionId) || auctionId <= 0 || auctionId !== 100) {
      client.close();
      return;
    }

    let seconds = 0;

    client.send({
      event: 'auction-price',
      data: createAuctionPayload(seconds),
    });

    const priceTimer = setInterval(() => {
      seconds += 1;
      client.send({
        event: 'auction-price',
        data: createAuctionPayload(seconds),
      });
    }, 1000);

    const pingTimer = setInterval(() => {
      client.send({
        event: 'ping',
        data: 'keep-alive',
      });
    }, 15000);
  }),
];
