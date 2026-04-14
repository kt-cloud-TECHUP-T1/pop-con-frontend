// src/mocks/handlers/auction.ts
import { delay, http, HttpResponse } from 'msw';
import type { AuctionData } from '@/types/sale-detail';

const mockAuctionData: AuctionData = {
  auctionId: 100,
  auctionStatus: 'OPEN',
  auctionOpenAt: '2026-03-11T14:48:13',
  auctionCloseAt: '2026-03-11T14:58:53',
  serverTime: formatLocalDateTime(new Date()),
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
function formatLocalDateTime(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

const mockAuctionDates = [
  { entryDate: '2026-03-10' },
  { entryDate: '2026-04-12' },
  { entryDate: '2026-04-14' },
];

const mockSlotsByDate: Record<
  string,
  {
    optionId: number;
    entryTime: string;
    remainingStock: number;
    pendingStock: number;
    selectable: boolean;
  }[]
> = {
  '2026-03-10': [
    {
      optionId: 1001,
      entryTime: '13:00:00',
      remainingStock: 5,
      pendingStock: 0,
      selectable: true,
    },
    {
      optionId: 1002,
      entryTime: '15:00:00',
      remainingStock: 0,
      pendingStock: 2,
      selectable: false,
    },
    {
      optionId: 1003,
      entryTime: '17:00:00',
      remainingStock: 0,
      pendingStock: 0,
      selectable: false,
    },
  ],
  '2026-04-12': [
    {
      optionId: 1004,
      entryTime: '12:00:00',
      remainingStock: 3,
      pendingStock: 0,
      selectable: true,
    },
    {
      optionId: 1005,
      entryTime: '14:00:00',
      remainingStock: 1,
      pendingStock: 0,
      selectable: true,
    },
  ],
  '2026-04-14': [
    {
      optionId: 1006,
      entryTime: '11:00:00',
      remainingStock: 0,
      pendingStock: 0,
      selectable: false,
    },
    {
      optionId: 1007,
      entryTime: '16:00:00',
      remainingStock: 2,
      pendingStock: 0,
      selectable: true,
    },
  ],
};

export const auctionHandlers = [
  http.get(
    '*/api/auctions/:auctionId/dates/:entryDate/options',
    async ({ params }) => {
      const auctionId = Number(params.auctionId);
      const entryDate = String(params.entryDate);

      await delay(300);

      if (!Number.isInteger(auctionId) || auctionId <= 0) {
        return HttpResponse.json(
          { code: 'C001', message: '입력값이 올바르지 않습니다.', data: null },
          { status: 400 }
        );
      }

      if (auctionId !== 100) {
        return HttpResponse.json(
          { code: 'AU001', message: '존재하지 않는 경매입니다.', data: null },
          { status: 404 }
        );
      }

      return HttpResponse.json({
        code: 'SUCCESS',
        message: '날짜별 입장 시간 목록 조회를 성공했습니다.',
        data: mockSlotsByDate[entryDate] ?? [],
      });
    }
  ),

  http.get('*/api/auctions/:auctionId/dates', async ({ params }) => {
    const auctionId = Number(params.auctionId);

    await delay(300);

    if (!Number.isInteger(auctionId) || auctionId <= 0) {
      return HttpResponse.json(
        { code: 'C001', message: '입력값이 올바르지 않습니다.', data: null },
        { status: 400 }
      );
    }

    if (auctionId !== 100) {
      return HttpResponse.json(
        { code: 'AU001', message: '존재하지 않는 경매입니다.', data: null },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      code: 'SUCCESS',
      message: '선택 가능한 날짜 목록 조회를 성공했습니다.',
      data: mockAuctionDates,
    });
  }),

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
      data: {
        ...mockAuctionData,
        serverTime: formatLocalDateTime(new Date()),
      },
    });
  }),
];
