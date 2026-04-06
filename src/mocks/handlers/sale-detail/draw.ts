// src/mocks/handlers/draw.ts
import { delay, http, HttpResponse } from 'msw';

const mockDrawData = {
  drawOpenAt: '2026-03-23T10:00:00',
  drawCloseAt: '2026-03-29T18:00:00',
  serverTime: '2026-03-24T12:10:00',
};

export const drawHandlers = [
  http.get('*/draws/:drawId', async ({ params }) => {
    const drawId = Number(params.drawId);

    await delay(300);

    if (!Number.isInteger(drawId) || drawId <= 0) {
      return HttpResponse.json(
        {
          code: 'C001',
          message: '입력값이 올바르지 않습니다.',
          data: {
            drawId: 'drawId는 양수여야 합니다.',
          },
        },
        { status: 400 }
      );
    }

    if (drawId !== 100) {
      return HttpResponse.json(
        {
          code: 'D001',
          message: '존재하지 않는 드로우입니다.',
          data: null,
        },
        { status: 404 }
      );
    }

    return HttpResponse.json(
      {
        code: 'SUCCESS',
        message: '드로우 상세 조회를 성공했습니다.',
        data: mockDrawData,
      },
      { status: 200 }
    );
  }),
];
