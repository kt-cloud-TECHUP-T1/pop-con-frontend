// src/mocks/handlers/draw.ts
import { delay, http, HttpResponse } from 'msw';

const mockDrawData = {
  drawId: 100,
  drawOpenAt: '2026-04-14T23:02:00',
  drawCloseAt: '2026-04-14T23:22:00',
  serverTime: formatLocalDateTime(new Date()),
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

const mockDrawDates = [
  { entryDate: '2026-03-10' },
  { entryDate: '2026-04-12' },
  { entryDate: '2026-04-14' },
];

const mockDrawSlotsByDate: Record<
  string,
  { optionId: number; entryTime: string }[]
> = {
  '2026-03-10': [
    { optionId: 2001, entryTime: '13:00:00' },
    { optionId: 2002, entryTime: '15:00:00' },
    { optionId: 2003, entryTime: '17:00:00' },
  ],
  '2026-04-12': [
    { optionId: 2004, entryTime: '12:00:00' },
    { optionId: 2005, entryTime: '14:00:00' },
  ],
  '2026-04-14': [
    { optionId: 2006, entryTime: '11:00:00' },
    { optionId: 2007, entryTime: '16:00:00' },
  ],
};

export const drawHandlers = [
  http.get(
    '*/api/draws/:drawId/dates/:entryDate/options',
    async ({ params }) => {
      const drawId = Number(params.drawId);
      const entryDate = String(params.entryDate);

      await delay(300);

      if (!Number.isInteger(drawId) || drawId <= 0) {
        return HttpResponse.json(
          { code: 'C001', message: '입력값이 올바르지 않습니다.', data: null },
          { status: 400 }
        );
      }

      if (drawId !== 100) {
        return HttpResponse.json(
          { code: 'D001', message: '존재하지 않는 드로우입니다.', data: null },
          { status: 404 }
        );
      }

      return HttpResponse.json({
        code: 'SUCCESS',
        message: '날짜별 입장 시간 목록 조회를 성공했습니다.',
        data: mockDrawSlotsByDate[entryDate] ?? [],
      });
    }
  ),

  http.get('*/api/draws/:drawId/dates', async ({ params }) => {
    const drawId = Number(params.drawId);

    await delay(300);

    if (!Number.isInteger(drawId) || drawId <= 0) {
      return HttpResponse.json(
        { code: 'C001', message: '입력값이 올바르지 않습니다.', data: null },
        { status: 400 }
      );
    }

    if (drawId !== 100) {
      return HttpResponse.json(
        { code: 'D001', message: '존재하지 않는 드로우입니다.', data: null },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      code: 'SUCCESS',
      message: '선택 가능한 날짜 목록 조회를 성공했습니다.',
      data: mockDrawDates,
    });
  }),

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
        data: {
          ...mockDrawData,
          serverTime: formatLocalDateTime(new Date()),
        },
      },
      { status: 200 }
    );
  }),
];
