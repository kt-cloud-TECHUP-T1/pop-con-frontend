import { PageHeader } from '@/components/shared/page-header';
import { PaymentMethodsPageClient } from '@/app/(protected)/mypage/info/payment-methods/components/payment-methods-page-client';

const paymentMethods = [
  {
    id: 1,
    brandCode: 'HYUNDAI' as const,
    brand: '현대카드',
    maskedNumber: '****-****-****-1234',
    isPrimary: true,
  },
  {
    id: 2,
    brandCode: 'TOSS' as const,
    brand: '토스카드',
    maskedNumber: '****-****-****-1234',
    isPrimary: false,
  },
  {
    id: 3,
    brandCode: 'HYUNDAI' as const,
    brand: '현대카드',
    maskedNumber: '****-****-****-1234',
    isPrimary: false,
  },
  {
    id: 4,
    brandCode: 'TOSS' as const,
    brand: '토스카드',
    maskedNumber: '****-****-****-1234',
    isPrimary: false,
  },
  {
    id: 5,
    brandCode: 'HYUNDAI' as const,
    brand: '현대카드',
    maskedNumber: '****-****-****-1234',
    isPrimary: false,
  },
  {
    id: 6,
    brandCode: 'TOSS' as const,
    brand: '토스카드',
    maskedNumber: '****-****-****-1234',
    isPrimary: false,
  },
];

export default function MyPageInfoPaymentMethodsPage() {
  return (
    <>
      <PageHeader
        title="결제수단 관리"
        titleVariant="heading-1"
        titleWeight="bold"
      />

      <PaymentMethodsPageClient initialPaymentMethods={paymentMethods} />
    </>
  );
}
