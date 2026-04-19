import { DrawEntryErrorCode } from '@/constants/draw-apply';

export type DrawEntryRequest = {
  isPrivacyAgreed: boolean;
  isTermsAgreed: boolean;
};

export type DrawEntryValidationErrorData = {
  isPrivacyAgreed?: string;
  isTermsAgreed?: string;
};

export type DrawEntrySuccessData = {
  thumbnailUrl: string;
  popupTitle: string;
  popupAddress: string;
  entryDate: string;
  entryTime: string;
  userName: string;
  userPhoneNumber: string;
};

export type DrawEntryResult =
  | {
      code: 'SUCCESS';
      message: string;
      data: DrawEntrySuccessData;
    }
  | {
      code: 'C001';
      message: string;
      data: DrawEntryValidationErrorData;
    }
  | {
      code: Exclude<DrawEntryErrorCode, 'C001'>;
      message: string;
      data: null;
    };
