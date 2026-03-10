import type { MyPageSidebarSection } from '@/features/mypage/types/navigation';

export const MY_PAGE_SIDEBAR: MyPageSidebarSection[] = [
  {
    title: '내 정보',
    items: [
      {
        label: '프로필 관리',
        href: '/mypage/info/profile',
        match: 'prefix',
      },
      {
        label: '결제수단 관리',
        href: '/mypage/info/payment-methods',
        match: 'prefix',
      },
    ],
  },
  {
    title: '활동',
    items: [
      {
        label: '내 티켓',
        href: '/mypage/info/tickets',
        match: 'prefix',
      },
      {
        label: '드로우 내역',
        href: '/mypage/activity/draws',
        match: 'prefix',
      },
      { label: '낙찰 내역', href: '/mypage/activity/bids', match: 'prefix' },
      {
        label: '작성한 리뷰',
        href: '/mypage/activity/reviews',
        match: 'prefix',
      },
      {
        label: '찜 목록',
        href: '/mypage/activity/liked-popups',
        match: 'prefix',
      },
    ],
  },
  {
    title: '기타',
    items: [
      { label: '설정', href: '/mypage/others/settings', match: 'prefix' },
      {
        label: '고객센터',
        href: '/support',
        match: 'prefix',
      },
    ],
  },
] satisfies MyPageSidebarSection[];
