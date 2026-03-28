export type ActivityStatusTone = 'neutral' | 'warning' | 'danger' | 'success';

export type ActivityTab = 'draw' | 'bid';

export type ActivityItem = {
  id: number;
  title: string;
  price: string;
  paidAt: string;
  stateLabel: string;
  stateTone: ActivityStatusTone;
  isResultPending?: boolean;
};
