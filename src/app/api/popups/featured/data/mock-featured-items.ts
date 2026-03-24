import type { PopupCardDto } from '@/types/api/home';

export type MockFeaturedItem = PopupCardDto & {
  weightedScore: number;
};

export const mockFeaturedItems: MockFeaturedItem[] = [
  {
    weightedScore: 5050,
    popupId: 101,
    title: '망그러진 곰 팝업 스토어',
    supportingText: null,
    subText: '성수 XYZ',
    caption: '망그러진 곰과 함께하는 특별한 팝업입니다.',
    thumbnailUrl: 'https://cdn.popcon.com/popups/101/thumb.jpg',
    liked: true,
    stats: {
      likeCount: 320,
      viewCount: 1850,
    },
    overlay: null,
    phase: {
      type: 'DRAW',
      status: 'OPEN',
      openAt: '2026-03-06T10:00:00+09:00',
      closeAt: '2026-03-20T20:00:00+09:00',
    },
  },
  {
    weightedScore: 3520,
    popupId: 102,
    title: 'Butter Bear POP-UP STORE',
    supportingText: null,
    subText: '더현대 서울',
    caption: '버터베어 한정 굿즈를 만나보세요.',
    thumbnailUrl: 'https://cdn.popcon.com/popups/102/thumb.jpg',
    liked: false,
    stats: {
      likeCount: 210,
      viewCount: 1420,
    },
    overlay: null,
    phase: {
      type: 'DRAW',
      status: 'OPEN',
      openAt: '2026-03-05T10:00:00+09:00',
      closeAt: '2026-03-18T20:00:00+09:00',
    },
  },
  {
    weightedScore: 2200,
    popupId: 103,
    title: 'Blue Bottle Seongsu Pop-up',
    supportingText: null,
    subText: '성수동 블루보틀',
    caption: '현장 한정 굿즈와 시그니처 메뉴를 만나보세요.',
    thumbnailUrl: 'https://cdn.popcon.com/popups/103/thumb.jpg',
    liked: false,
    stats: {
      likeCount: 120,
      viewCount: 1000,
    },
    overlay: null,
    phase: {
      type: 'DRAW',
      status: 'UPCOMING',
      openAt: '2026-03-21T10:00:00+09:00',
      closeAt: '2026-03-30T20:00:00+09:00',
    },
  },
];
