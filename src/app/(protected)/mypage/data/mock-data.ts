import type { ActivityItem, ActivityTab } from '@/app/(protected)/mypage/types';

export const activityItems: Record<ActivityTab, ActivityItem[]> = {
  draw: [
    {
      id: 1,
      title: '성수 빈티지 북 페어',
      price: '25,000원',
      paidAt: '2026.02.22',
      stateLabel: '드로우 진행중',
      stateTone: 'neutral',
    },
    {
      id: 2,
      title: '한남 리빙 셀렉트샵',
      price: '31,000원',
      paidAt: '2026.02.17',
      stateLabel: '결과 확인 대기중',
      stateTone: 'warning',
      isResultPending: true,
    },
    {
      id: 3,
      title: '연남 한정판 마켓',
      price: '14,000원',
      paidAt: '2026.02.14',
      stateLabel: '드로우 미당첨',
      stateTone: 'danger',
    },
    {
      id: 4,
      title: '압구정 스니커즈 셀렉션',
      price: '18,000원',
      paidAt: '2026.02.11',
      stateLabel: '드로우 당첨',
      stateTone: 'success',
    },
  ],
  bid: [
    {
      id: 5,
      title: '한정판 포스터 경매',
      price: '42,000원',
      paidAt: '2026.02.20',
      stateLabel: '낙찰 완료',
      stateTone: 'success',
    },
    {
      id: 6,
      title: '로컬 아티스트 굿즈',
      price: '27,000원',
      paidAt: '2026.02.18',
      stateLabel: '입찰 진행중',
      stateTone: 'neutral',
    },
    {
      id: 7,
      title: '콜렉터 에디션 토이',
      price: '65,000원',
      paidAt: '2026.02.13',
      stateLabel: '낙찰 실패',
      stateTone: 'danger',
    },
    {
      id: 8,
      title: '성수 포토북 셋',
      price: '33,000원',
      paidAt: '2026.02.09',
      stateLabel: '결제 대기',
      stateTone: 'warning',
    },
  ],
};

export const activityTabs = [
  { label: '드로우', value: 'draw' as const },
  { label: '낙찰', value: 'bid' as const },
];
