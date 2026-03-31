import { DrawEntryErrorCode } from '@/constants/draw-apply';

export type DrawEntryRequest = {
  isPrivacyAgreed: boolean;
  isTermsAgreed: boolean;
};

export type DrawEntryValidationErrorData = {
  isPrivacyAgreed?: string;
  isTermsAgreed?: string;
};

export type DrawEntryResult =
  | {
      code: 'SUCCESS';
      message: string;
      data: null;
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
