import type { ApiResponse } from './common';

export type PopupSectionKey = 'BANNERS';

export type PopupPhaseType = 'DRAW';

export type PopupPhaseStatus = 'OPEN' | 'UPCOMING' | 'ENDED';

export type PopupPhase = {
  type: PopupPhaseType;
  status: PopupPhaseStatus;
  openAt: string;
  closeAt: string;
};

export type PopupCardDto = {
  popupId: number;
  title: string;
  supportingText: string | null;
  subText: string | null;
  caption: string | null;
  thumbnailUrl: string | null;
  liked: boolean | null;
  stats: null;
  overlay: null;
  phase: PopupPhase;
};

export type PopupSectionResponse = {
  sectionKey: PopupSectionKey;
  itemCount: number;
  items: PopupCardDto[];
};

export type PopupSectionApiResponse = ApiResponse<PopupSectionResponse>;
