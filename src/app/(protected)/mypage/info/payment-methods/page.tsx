import { PageHeader } from '@/components/shared/page-header';
import { PaymentMethodsPageClient } from '@/app/(protected)/mypage/info/payment-methods/components/payment-methods-page-client';

export default function MyPageInfoPaymentMethodsPage() {
  return (
    <>
      <PageHeader
        title="결제수단 관리"
        titleVariant="heading-1"
        titleWeight="bold"
      />

      <PaymentMethodsPageClient />
    </>
  );
}
