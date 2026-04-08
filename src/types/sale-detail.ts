export type PopupPhaseType = 'AUCTION' | 'DRAW';

export interface PopupDetailData {
  phaseType: PopupPhaseType;
  popupId: number;
  liked: boolean;
  thumbnailUrl: string;
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
  auctionId: number | null;
  drawId: number | null;
}

export interface PopupDetailResponse {
  code: 'SUCCESS';
  message: string;
  data: PopupDetailData;
}

export interface PopupDetailErrorResponse {
  code: 'C001' | 'S001' | string;
  message: string;
  data: Record<string, string> | null;
}

export type AuctionStatus = 'SCHEDULED' | 'OPEN' | 'SOLD_OUT' | 'CLOSED';
export type AuctionButtonStatus = 'WAITING' | 'ENABLED' | 'SOLD_OUT' | 'ENDED';

export interface AuctionData {
  auctionId: number;
  auctionStatus: AuctionStatus;
  serverTime: string;
  auctionOpenAt: string;
  auctionCloseAt: string;
  remainingUntilOpenSeconds: number;
  remainingUntilCloseSeconds: number;
  startPrice: number;
  minimumPrice: number;
  currentPrice: number | null;
  nextPrice: number | null;
  discountAmount: number | null;
  priceDropUnit: number;
  priceDropIntervalSeconds: number;
  secondsUntilNextDrop: number;
  maxPurchaseQuantityPerRound: number;
  canParticipate: boolean;
  buttonStatus: AuctionButtonStatus;
}

export interface AuctionDetailResponse {
  code: 'SUCCESS';
  message: string;
  data: AuctionData;
}

export interface AuctionErrorResponse {
  code: 'AU001' | 'C001' | 'S001' | string;
  message: string;
  data: Record<string, string> | null;
}

export interface DrawData {
  drawId: number;
  drawOpenAt: string;
  drawCloseAt: string;
  serverTime: string;
}

export interface DrawDetailResponse {
  code: 'SUCCESS';
  message: string;
  data: DrawData;
}

export interface DrawErrorResponse {
  code: 'D001' | 'C001' | 'S001' | string;
  message: string;
  data: Record<string, string> | null;
}
