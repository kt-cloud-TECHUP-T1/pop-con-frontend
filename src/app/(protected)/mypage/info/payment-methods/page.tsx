import { MyPageHeader } from '@/app/(protected)/mypage/components/page-header';
import { paymentMethods } from '@/app/(protected)/mypage/data/mock-data';
import { PaymentMethodsPageClient } from '@/app/(protected)/mypage/info/payment-methods/components/payment-methods-page-client';

export default function MyPageInfoPaymentMethodsPage() {
  return (
    <>
      <MyPageHeader
        title="결제수단 관리"
        titleVariant="heading-1"
        titleWeight="bold"
      />

      <PaymentMethodsPageClient initialPaymentMethods={paymentMethods} />
    </>
  );
}
