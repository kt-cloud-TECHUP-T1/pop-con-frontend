import { delay, http, HttpResponse } from 'msw';

// 폴링 횟수 카운터 - 3번 폴링 후 ACTIVE로 전환
let pollCount = 0;

export const queueHandlers = [
  // 드로우 대기열 진입
  http.post('*/api/queue/draws/:drawId', async ({ params }) => {
    await delay(300);

    pollCount = 0;
    console.log('[MSW] 드로우 대기열 진입 - drawId:', params.drawId);

    return HttpResponse.json({
      code: 'SUCCESS',
      message: '대기열 진입에 성공했습니다.',
      data: {
        status: 'WAITING',
        // status: 'ACTIVE',
        queueToken: 'mock-queue-token-abc123',
        position: 5,
        estimatedWaitSeconds: 15,
        pollAfterMs: 3000,
      },
    });
  }),

  // 대기열 상태 조회 (폴링)
  http.get('*/api/queue/status', async () => {
    await delay(300);

    pollCount += 1;
    console.log('[MSW] 대기열 상태 조회 - pollCount:', pollCount);

    if (pollCount >= 3) {
      return HttpResponse.json({
        code: 'SUCCESS',
        message: '입장이 허가되었습니다.',
        data: {
          status: 'ACTIVE',
        },
      });
    }

    return HttpResponse.json({
      code: 'SUCCESS',
      message: '대기 중입니다.',
      data: {
        status: 'WAITING',
        position: Math.max(1, 5 - pollCount),
        estimatedWaitSeconds: Math.max(3, 15 - pollCount * 5),
        pollAfterMs: 30000,
      },
    });
  }),
];
