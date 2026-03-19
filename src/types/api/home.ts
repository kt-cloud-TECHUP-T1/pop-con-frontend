import type { ApiResponse } from './common';

// ================================================
// Section
// ================================================

export type PopupSectionKey = 'BANNERS' | 'FEATURED';

export type PopupSectionResponse = {
  sectionKey: PopupSectionKey;
  itemCount: number;
  items: PopupCardDto[];
};

export type PopupSectionApiResponse = ApiResponse<PopupSectionResponse>;

// ================================================
// Card
// ================================================

export type PopupCardDto = {
  popupId: number;
  title: string;
  supportingText: string | null;
  subText: string | null;
  caption: string | null;
  thumbnailUrl: string | null;
  liked: boolean | null;
  stats: PopupCardStats | null;
  overlay: null;
  phase: PopupPhase;
};

export type PopupCardStats = {
  likeCount: number;
  viewCount: number;
};

// ================================================
// Phase
// ================================================

export type PopupPhaseType = 'AUCTION' | 'DRAW';

export type PopupPhaseStatus = 'OPEN' | 'UPCOMING' | 'CLOSED' | 'ENDED';

export type PopupPhase = {
  type: PopupPhaseType;
  status: PopupPhaseStatus;
  openAt: string;
  closeAt: string;
};
