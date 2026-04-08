// src/mocks/handlers/billing-keys.ts
import { http, HttpResponse } from 'msw';

type RegisterBillingKeyRequest = {
  customerUid?: string;
};

type RegisterBillingKeySuccessResponse = {
  code: 'SUCCESS';
  message: string;
  data: {
    id: number;
    cardName: string;
    cardNumber: string;
    isDefault: boolean;
    registeredAt: string;
  };
};

type RegisterBillingKeyErrorResponse = {
  code: 'C001' | 'A002' | 'A003' | 'S001';
  message: string;
  data: { customerUid: string } | null;
};

const VALID_ACCESS_TOKEN = 'tempAccessToken';

export const billingKeyHandlers = [
  http.post<
    never,
    RegisterBillingKeyRequest,
    RegisterBillingKeySuccessResponse | RegisterBillingKeyErrorResponse
  >('*/billing/keys', async ({ request }) => {
    const authorization = request.headers.get('Authorization');
    const body = await request.json();

    // 1️⃣ Authorization 체크
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

    // 2️⃣ 만료 토큰
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

    // 3️⃣ 유효하지 않은 토큰
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

    // 4️⃣ customerUid 체크 (⭐ 핵심: 아무 문자열이면 OK)
    if (!body.customerUid || body.customerUid.trim() === '') {
      return HttpResponse.json(
        {
          code: 'C001',
          message: '입력값이 올바르지 않습니다.',
          data: {
            customerUid: '빌링키 식별자는 필수입니다.',
          },
        },
        { status: 400 }
      );
    }

    // 5️⃣ 성공
    return HttpResponse.json(
      {
        code: 'SUCCESS',
        message: '결제 수단이 성공적으로 등록되었습니다.',
        data: {
          id: 1,
          cardName: '삼성카드',
          cardNumber: '53614800****000*',
          isDefault: true,
          registeredAt: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  }),
];
