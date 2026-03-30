// src/mocks/handlers/billing-my.ts
import { http, HttpResponse } from 'msw';

type BillingCard = {
  id: number;
  cardName: string;
  cardNumber: string;
  isDefault: boolean;
  registeredAt: string;
};

type GetBillingCardsSuccessResponse = {
  code: 'SUCCESS';
  message: string;
  data: BillingCard[];
};

type GetBillingCardsErrorResponse = {
  code: 'U001' | 'A002' | 'A003' | 'S001';
  message: string;
  data: null;
};

const VALID_ACCESS_TOKEN = 'tempAccessToken';

export const billingMyHandlers = [
  http.get<
    never,
    never,
    GetBillingCardsSuccessResponse | GetBillingCardsErrorResponse
  >('*/billing/my', async ({ request }) => {
    const authorization = request.headers.get('Authorization');

    // 1) Authorization 체크
    if (!authorization?.startsWith('Bearer ')) {
      return HttpResponse.json(
        {
          code: 'A002',
          message: '유효하지 않은 토큰입니다.',
          data: null,
        },
        { status: 401 }
      );
    }

    const accessToken = authorization.replace('Bearer ', '');

    // 2) 만료 토큰
    if (accessToken === 'expiredAccessToken') {
      return HttpResponse.json(
        {
          code: 'A003',
          message: '인증이 만료되었습니다. 다시 로그인해주세요.',
          data: null,
        },
        { status: 401 }
      );
    }

    // 3) 유효하지 않은 토큰
    if (accessToken !== VALID_ACCESS_TOKEN) {
      return HttpResponse.json(
        {
          code: 'A002',
          message: '유효하지 않은 토큰입니다.',
          data: null,
        },
        { status: 401 }
      );
    }

    // 4) 성공
    return HttpResponse.json(
      {
        code: 'SUCCESS',
        message: '결제 수단 목록을 성공적으로 조회했습니다.',
        data: [
          {
            id: 1,
            cardName: '현대카드',
            cardNumber: '1234-****-****-****',
            isDefault: true,
            registeredAt: '2026-03-27T10:00:00',
          },
          {
            id: 2,
            cardName: '신한카드',
            cardNumber: '5678-****-****-****',
            isDefault: false,
            registeredAt: '2026-03-27T11:00:00',
          },
        ],
      },
      { status: 200 }
    );
  }),
];
