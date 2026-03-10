export type CardBrandCode = 'HYUNDAI' | 'TOSS';

export type PaymentMethod = {
  id: number;
  brandCode: CardBrandCode;
  brand: string;
  maskedNumber: string;
  isPrimary: boolean;
};
