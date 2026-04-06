import { http, HttpResponse } from 'msw';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

type DrawEntryRequestBody = {
  isPrivacyAgreed: boolean;
  isTermsAgreed: boolean;
};

export const drawEntryHandlers = [
  http.post(
    `${API_BASE_URL}/draws/:drawId/options/:optionId/entries`,
    async ({ request, params }) => {
      const authorization = request.headers.get('Authorization');
      const drawId = Number(params.drawId);
      const optionId = Number(params.optionId);

      const body = (await request.json()) as DrawEntryRequestBody;

      if (authorization !== 'Bearer tempToken') {
        return HttpResponse.json(
          {
            code: 'A002',
            message: '유효하지 않은 토큰입니다.',
            data: null,
          },
          { status: 401 }
        );
      }

      if (!body.isPrivacyAgreed || !body.isTermsAgreed) {
        return HttpResponse.json(
          {
            code: 'C001',
            message: '입력값이 올바르지 않습니다.',
            data: {
              ...(body.isPrivacyAgreed
                ? {}
                : {
                    isPrivacyAgreed:
                      '개인정보 수집 및 이용에 동의해야 응모가 가능합니다.',
                  }),
              ...(body.isTermsAgreed
                ? {}
                : {
                    isTermsAgreed: '이용약관에 동의해야 응모가 가능합니다.',
                  }),
            },
          },
          { status: 400 }
        );
      }

      if (drawId !== 100) {
        return HttpResponse.json(
          {
            code: 'D002',
            message: '현재 진행 중인 드로우가 아닙니다.',
            data: null,
          },
          { status: 400 }
        );
      }

      if (optionId === 200) {
        return HttpResponse.json(
          {
            code: 'SUCCESS',
            message: '드로우 응모가 완료되었습니다.',
            data: {
              vThumbnailUrl:
                'https://cdn.popcon.com/images/popups/123/vertical.jpg',
              popupTitle: '성수동 팝콘 팝업스토어',
              popupAddress: '서울특별시 성동구 성수동2가 123-45',
              entryDate: '2026-04-15',
              entryTime: '14:00:00',
              userName: '홍길동',
              userPhoneNumber: '010-1234-5678',
            },
          },
          { status: 200 }
        );
      }

      if (optionId === 300) {
        return HttpResponse.json(
          {
            code: 'D005',
            message: '이미 해당 회차에 응모하셨습니다.',
            data: null,
          },
          { status: 409 }
        );
      }

      return HttpResponse.json(
        {
          code: 'D003',
          message: '이미 종료된 드로우입니다.',
          data: null,
        },
        { status: 400 }
      );
    }
  ),
];
