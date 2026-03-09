import type { IconName } from '@/components/Icon/Icon';
import type { ActivityStatusTone } from '@/app/(protected)/mypage/components/activity-history/types';

export type ActivityTab = 'draw' | 'bid';

export type SummaryCard = {
  label: string;
  value: string;
  icon: IconName;
};

export type SummaryStat = {
  label: string;
  value: number;
};

export type ActivityItem = {
  id: number;
  title: string;
  price: string;
  paidAt: string;
  stateLabel: string;
  stateTone: ActivityStatusTone;
};

export type LikedPopupItem = {
  id: number;
  title: string;
  description: string;
  caption: string;
  thumbnailUrl: string;
};
