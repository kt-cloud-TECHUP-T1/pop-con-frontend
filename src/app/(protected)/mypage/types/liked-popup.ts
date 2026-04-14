export interface LikedPopup {
  popupId: number;
  title: string;
  supportingText: string;
  subText: string;
  caption: string;
  thumbnailUrl: string;
  liked: boolean;
  stats: {
    likeCount: number;
    viewCount: number;
  };
  overlay: {
    type: string | null;
    rank: number | null;
  } | null;
  phase: {
    type: 'AUCTION' | 'DRAW';
    status: string;
    openAt: string;
    closeAt: string;
  };
}

export interface LikedPopupsData {
  content: LikedPopup[];
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}
