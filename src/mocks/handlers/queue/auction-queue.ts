// src/mocks/handlers/auction-queue.ts
import { http, HttpResponse } from 'msw';
import type { EnterAuctionQueueResponse } from '@/types/queue/queue';

type Params = {
  auctionId: string;
};

export const auctionQueueHandlers = [
  http.post<Params, never, EnterAuctionQueueResponse>(
    '*/queues/auctions/:auctionId',
    async ({ params }) => {
      const auctionId = Number(params.auctionId);

      // 1️⃣ auctionId 검증
      if (!auctionId || Number.isNaN(auctionId)) {
        return HttpResponse.json(
          {
            code: 'C001',
            message: '입력값이 올바르지 않습니다.',
            data: null,
          },
          { status: 400 }
        );
      }

      // 2️⃣ 100이 아니면 실패
      if (auctionId !== 100) {
        return HttpResponse.json(
          {
            code: 'C001',
            message: '입력값이 올바르지 않습니다.',
            data: null,
          },
          { status: 400 }
        );
      }

      // 3️⃣ 100일 때만 성공 (WAITING으로 고정)
      return HttpResponse.json(
        {
          code: 'SUCCESS',
          message: '대기열 진입에 성공했습니다.',
          data: {
            status: 'WAITING',
            queueToken: `auction-queue-token-${auctionId}`,
            position: 10,
            estimatedWaitSeconds: 30,
            pollAfterMs: 3000,
          },
        },
        { status: 200 }
      );
    }
  ),
];
