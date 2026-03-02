import type {
  ActivityTabItem,
  MyPageSidebarSection,
} from '@/types/mypage';

export const MY_PAGE_SIDEBAR: MyPageSidebarSection[] = [
  {
    title: '내 정보',
    items: [{ label: '개인정보 관리', href: '/mypage/profile', match: 'prefix' }],
  },
  {
    title: '결제',
    items: [{ label: '결제수단 관리', href: '/mypage/payment-methods', match: 'prefix' }],
  },
  {
    title: '활동',
    items: [
      { label: '낙찰 내역', href: '/mypage/activity/bids', match: 'prefix' },
      { label: '드로우 응모 내역', href: '/mypage/activity/draws', match: 'prefix' },
      { label: '내 리뷰', href: '/mypage/activity/reviews', match: 'prefix' },
    ],
  },
  {
    title: '기타',
    items: [
      { label: '설정', href: '/mypage/settings', match: 'prefix' },
      { label: '고객센터', href: '/mypage/support', match: 'prefix' },
    ],
  },
] satisfies MyPageSidebarSection[];

export const ACTIVITY_TABS: ActivityTabItem[] = [
  { label: '내 티켓', value: 'tickets' },
  { label: '낙찰 내역', value: 'bids' },
  { label: '드로우 응모 내역', value: 'draws' },
  { label: '리뷰 관리', value: 'reviews' },
] satisfies ActivityTabItem[];
