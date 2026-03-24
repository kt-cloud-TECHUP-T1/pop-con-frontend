import { http, HttpResponse } from 'msw';

const popupDetailMockData = {
  phaseType: 'AUCTION',
  phaseStatus: 'OPEN',
  popupId: 100,
  liked: true,
  thumbnailUrl: 'https://imagelink.com/thumbnail.jpg',
  images: [
    'https://imagelink.com/image1.jpg',
    'https://imagelink.com/image2.jpg',
    'https://imagelink.com/image3.jpg',
  ],
  subtitle: 'Oneira X POPUP SEOUL',
  title: '오네이라 팝업 스토어',
  viewCount: 10,
  likeCount: 198,
  description: `Lee가 101 라인 101주년을 기념해 더현대 서울에서 팝업을 진행합니다.👖
오랜 시간 쌓아온 데님 헤리티지와 101 라인의 상징성을 공간 안에 풀어냈습니다.
다양한 리워드와 팝업 기간동안의 특별한 혜택을 받아보세요!🩵`,
  location: '서울 영등포구 여의대로 108, 더현대 서울',
  reviewCount: 0,
  openAt: '2026-03-11',
  closeAt: '2026-03-15',
  weekdayOpen: '11:00',
  weekdayClose: '21:00',
  weekendOpen: '10:00',
  weekendClose: '22:00',
  auctionId: 100,
  drawId: 100,
};

export const popupDetailHandlers = [
  http.get('*/popups/:popupId', ({ params }) => {
    const popupId = Number(params.popupId);

    if (Number.isNaN(popupId)) {
      return HttpResponse.json(
        {
          code: 'C001',
          message: '입력값이 올바르지 않습니다.',
          data: {
            popupId: '팝업스토어 아이디는 필수입니다.',
          },
        },
        { status: 400 }
      );
    }

    if (popupId !== 100) {
      return HttpResponse.json(
        {
          code: 'S001',
          message: '시스템 오류가 발생했습니다.',
          data: null,
        },
        { status: 500 }
      );
    }

    return HttpResponse.json({
      code: 'SUCCESS',
      message: '팝업스토어 조회를 성공했습니다.',
      data: {
        ...popupDetailMockData,
        popupId,
      },
    });
  }),
];
