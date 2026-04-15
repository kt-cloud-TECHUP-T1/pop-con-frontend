export interface PopupLikeResponse {
  code: 'SUCCESS';
  message: string;
}

export type PopupLikeErrorCode = 'C001' | 'P001' | 'A003' | 'S001';

export interface PopupLikeErrorResponse {
  code: PopupLikeErrorCode;
  message: string;
}

export type LikedPopupState = Record<
  number,
  {
    isLiked: boolean;
    likeCount: number;
  }
>;

export interface PopupUnlikeResponse {
  code: 'SUCCESS';
  message: string;
}

export type PopupUnlikeErrorCode = 'C001' | 'P001' | 'A003' | 'S001';

export interface PopupUnlikeErrorResponse {
  code: PopupUnlikeErrorCode;
  message: string;
}
