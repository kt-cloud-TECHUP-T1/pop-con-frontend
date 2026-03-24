// src/mocks/handlers/auction.ts
import { delay, http, HttpResponse } from 'msw';
import type { AuctionData } from '@/types/sale-detail';

const mockAuctionData: AuctionData = {
  auctionId: 100,
  auctionStatus: 'CLOSED',
  serverTime: '2026-03-11T14:49:15',
  auctionOpenAt: '2026-03-11T14:48:13',
  auctionCloseAt: '2026-03-11T14:58:53',
  remainingUntilOpenSeconds: 0,
  remainingUntilCloseSeconds: 578,
  startPrice: 100000,
  minimumPrice: 30000,
  currentPrice: 96000,
  nextPrice: 95000,
  discountAmount: 4000,
  priceDropUnit: 1000,
  priceDropIntervalSeconds: 10,
  secondsUntilNextDrop: 4,
  maxPurchaseQuantityPerRound: 10,
  canParticipate: true,
  buttonStatus: 'WAITING',
};

export const auctionHandlers = [
  http.get('*/auctions/:auctionId', async ({ params }) => {
    const auctionId = Number(params.auctionId);

    await delay(300);

    if (!Number.isInteger(auctionId) || auctionId <= 0) {
      return HttpResponse.json(
        {
          code: 'C001',
          message: '입력값이 올바르지 않습니다.',
          data: {
            auctionId: 'auctionId는 양수여야 합니다.',
          },
        },
        { status: 400 }
      );
    }

    if (auctionId !== 100) {
      return HttpResponse.json(
        {
          code: 'AU001',
          message: '존재하지 않는 경매입니다.',
          data: null,
        },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      code: 'SUCCESS',
      message: '경매 상세 조회를 성공했습니다',
      data: mockAuctionData,
    });
  }),
];
