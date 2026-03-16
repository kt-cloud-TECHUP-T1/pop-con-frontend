import type { PopupCardDto } from '@/types/api/home';

export type MockBannerItem = PopupCardDto & {
  priority: number;
};

export const mockBannerItems: MockBannerItem[] = [
  {
    priority: 1,
    popupId: 101,
    title: 'T1 팝업 스토어',
    supportingText: 'T1 × POPUP SEOUL',
    subText: null,
    caption: '캡션 문구',
    thumbnailUrl: 'https://cdn.popcon.com/banners/101.jpg',
    liked: null,
    stats: null,
    overlay: null,
    phase: {
      type: 'DRAW',
      status: 'OPEN',
      openAt: '2026-03-01T10:00:00+09:00',
      closeAt: '2026-03-10T20:00:00+09:00',
    },
  },
  {
    priority: 2,
    popupId: 102,
    title: '하이카와 베이비 팝업',
    supportingText: 'THE HYUNDAI SEOUL, 5F EPIC SEOUL',
    subText: null,
    caption: '캡션 문구',
    thumbnailUrl: null,
    liked: null,
    stats: null,
    overlay: null,
    phase: {
      type: 'DRAW',
      status: 'UPCOMING',
      openAt: '2026-03-12T10:00:00+09:00',
      closeAt: '2026-03-20T20:00:00+09:00',
    },
  },
  {
    priority: 3,
    popupId: 103,
    title: '한정 굿즈 래플',
    supportingText: '성수 팝업 아카이브',
    subText: null,
    caption: '종료된 배너 예시',
    thumbnailUrl: null,
    liked: null,
    stats: null,
    overlay: null,
    phase: {
      type: 'DRAW',
      status: 'ENDED',
      openAt: '2026-02-01T10:00:00+09:00',
      closeAt: '2026-02-08T20:00:00+09:00',
    },
  },
];
