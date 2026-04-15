export interface BillingCard {
  id: number;
  cardName: string;
  cardNumber: string;
  isDefault: boolean;
  registeredAt: string;
}

export interface GetBillingListSuccessResponse {
  code: 'SUCCESS';
  message: string;
  data: BillingCard[];
}

export interface GetBillingListErrorResponse {
  code: 'U001' | 'A002' | 'A003' | 'S001';
  message: string;
  data: null;
}

export type GetBillingListResponse =
  | GetBillingListSuccessResponse
  | GetBillingListErrorResponse;
