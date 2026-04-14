export type ActivityStatusTone = 'neutral' | 'warning' | 'danger' | 'success';

export type ActivityTab = 'draw' | 'bid';

export type ActivityItem = {
  id: number;
  title: string;
  image: string | null;
  price: string;
  paidAt: string;
  stateLabel: string;
  stateTone: ActivityStatusTone;
  isResultPending?: boolean;
  drawResult?: 'lucky' | 'won' | 'notWon';
};

export interface DrawHistoryItem {
  id: number;
  drawId: number;
  vthumbnailUrl: string | null;
  title: string;
  price: number;
  paidAt: string | null;
  displayStatus: string;
  status: string;
}

export interface BidHistoryItem {
  id: number;
  thumbnailUrl: string | null;
  popupTitle: string;
  bidPrice: number;
  paidAt: string;
  displayStatus: string;
}
