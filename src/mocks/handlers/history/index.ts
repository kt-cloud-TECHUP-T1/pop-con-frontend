import { delay, http, HttpResponse } from 'msw';

const mockTickets = [
  {
    ticketId: 2,
    userId: 1,
    popupId: 200,
    ticketNumber: 'TKT00000002',
    reservationNo: null,
    status: 'ISSUED',
    sourceType: 'DRAW',
    sourceId: 1,
    entryDate: '2026-04-12',
    entryTime: '15:00:00',
    issuedAt: '2026-04-02T13:23:52.207464',
  },
  {
    ticketId: 1,
    userId: 1,
    popupId: 100,
    ticketNumber: 'TKT00000001',
    reservationNo: 'TKT297815537502',
    status: 'ISSUED',
    sourceType: 'AUCTION',
    sourceId: 1,
    entryDate: '2026-04-12',
    entryTime: '14:00:00',
    issuedAt: '2026-04-02T11:53:31.499038',
  },
];

const mockReservationMap: Record<string, (typeof mockTickets)[number]> = {
  TKT297815537502: mockTickets[1],
};

export const historyHandlers = [
  // 내 티켓 목록 조회
  http.get('*/api/history/tickets', async () => {
    await delay(300);

    console.log('[MSW] GET /api/history/tickets');

    return HttpResponse.json({
      code: 'SUCCESS',
      message: '티켓 목록 조회를 성공했습니다.',
      data: {
        content: mockTickets,
        first: true,
        last: true,
        numberOfElements: mockTickets.length,
        empty: false,
      },
    });
  }),

  // 내 티켓 상세 조회 (reservationNo 기준)
  http.get(
    '*/api/history/tickets/reservations/:reservationNo',
    async ({ params }) => {
      await delay(300);

      const { reservationNo } = params as { reservationNo: string };
      console.log(
        '[MSW] GET /api/history/tickets/reservations/:reservationNo',
        reservationNo
      );

      const ticket = mockReservationMap[reservationNo];

      if (!ticket) {
        return HttpResponse.json(
          { code: 'T001', message: '존재하지 않는 티켓입니다.' },
          { status: 404 }
        );
      }

      return HttpResponse.json({
        code: 'SUCCESS',
        message: '티켓 상세 조회를 성공했습니다.',
        data: ticket,
      });
    }
  ),
];
