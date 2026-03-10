import type { IconName } from '@/components/Icon/Icon';
import type { ActivityStatusTone } from '@/features/mypage/types/activity';
import type { DrawResult } from '@/features/mypage/draws/services/confirm-draw-result';

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
  isResultPending?: boolean;
  pendingResultMock?: DrawResult;
};

export type LikedPopupItem = {
  id: number;
  title: string;
  description: string;
  caption: string;
  thumbnailUrl: string;
};
