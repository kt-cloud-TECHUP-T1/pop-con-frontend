export interface PopupPhase {
  type: 'AUCTION' | 'DRAW';
  status: 'UPCOMING' | 'OPEN' | 'CLOSED';
  openAt: string;
  closeAt: string;
}

export interface BasePopupCard {
  popupId: number;
  title: string;
  supportingText: string | null;
  subText: string | null;
  caption: string | null;
  thumbnailUrl: string | null;
  liked: boolean | null;
  stats: {
    likeCount: number;
    viewCount: number;
  };
  overlay: { type: string; rank: number | null } | null;
  phase: PopupPhase;
}

export interface BaseCardResponse<T, S extends string = string> {
  sectionKey: S;
  itemCount: number;
  items: T[];
}
