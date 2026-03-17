export type PhaseType = 'AUCTION' | 'DRAW';
export type PhaseStatus = 'UPCOMING' | 'OPEN' | 'CLOSED';

export interface PopupDetailData {
  phaseType: PhaseType;
  phaseStatus: PhaseStatus;
  popupId: number;
  liked: boolean;
  thumbnailUrl: string;
  images: string[];
  subtitle: string;
  title: string;
  viewCount: number;
  likeCount: number;
  description: string;
  location: string;
  reviewCount: number;
  openAt: string;
  closeAt: string;
  weekdayOpen: string;
  weekdayClose: string;
  weekendOpen: string;
  weekendClose: string;
}

export interface PopupDetailResponse {
  code: string;
  message: string;
  data: PopupDetailData;
}
