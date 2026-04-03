// src/mocks/handlers/auction-reservation.ts
import { delay, http, HttpResponse } from 'msw';

const MOCK_ACCESS_TOKEN = 'tempToken';
const MOCK_RESERVATION_NO = 'tempTiket';

export const auctionReservationHandlers = [
  http.get(
    '*/auctions/reservations/:reservationNo',
    async ({ params, request }) => {
      const reservationNo = String(params.reservationNo ?? '');
      const authorization = request.headers.get('Authorization');

      await delay(500);

      if (authorization !== `Bearer ${MOCK_ACCESS_TOKEN}`) {
        return HttpResponse.json(
          {
            code: 'A004',
            message: '접근 권한이 없습니다.',
            data: null,
          },
          { status: 403 }
        );
      }

      if (reservationNo !== MOCK_RESERVATION_NO) {
        return HttpResponse.json(
          {
            code: 'AU010',
            message: '존재하지 않는 입찰 정보입니다.',
            data: null,
          },
          { status: 404 }
        );
      }

      return HttpResponse.json(
        {
          status: 'SUCCESS',
          message: '성공하였습니다.',
          data: {
            reservationNo: MOCK_RESERVATION_NO,
            popupTitle: '성수동 팝업',
            popupAddress: '서울시 성동구 성수동 1-1',
            entryDate: '2026-04-10',
            entryTime: '15:00:00',
            startPrice: 100000,
            discountAmount: 30000,
            finalPrice: 70000,
            paidAt: '2026-03-31T18:00:00',
          },
        },
        { status: 200 }
      );
    }
  ),
];
