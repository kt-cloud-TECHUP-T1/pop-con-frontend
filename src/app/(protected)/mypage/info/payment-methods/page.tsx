'use client';

import { useState } from 'react';
import { AddPaymentMethodButton } from '@/app/(protected)/mypage/info/payment-methods/components/add-payment-method-button';
import { PaymentMethodCard } from '@/app/(protected)/mypage/info/payment-methods/components/payment-method-card';
import type { PaymentMethod } from '@/app/(protected)/mypage/info/payment-methods/components/types';
import { MyPageHeader } from '../../components/page-header';

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 1,
    brandCode: 'HYUNDAI',
    brand: '현대카드',
    maskedNumber: '****-****-****-1234',
    isPrimary: true,
  },
  {
    id: 2,
    brandCode: 'TOSS',
    brand: '토스카드',
    maskedNumber: '****-****-****-1234',
    isPrimary: false,
  },
  {
    id: 3,
    brandCode: 'HYUNDAI',
    brand: '현대카드',
    maskedNumber: '****-****-****-1234',
    isPrimary: false,
  },
  {
    id: 4,
    brandCode: 'TOSS',
    brand: '토스카드',
    maskedNumber: '****-****-****-1234',
    isPrimary: false,
  },
  {
    id: 5,
    brandCode: 'HYUNDAI',
    brand: '현대카드',
    maskedNumber: '****-****-****-1234',
    isPrimary: false,
  },
  {
    id: 6,
    brandCode: 'TOSS',
    brand: '토스카드',
    maskedNumber: '****-****-****-1234',
    isPrimary: false,
  },
];

export default function MyPageInfoPaymentMethodsPage() {
  const [paymentMethods, setPaymentMethods] =
    useState<PaymentMethod[]>(PAYMENT_METHODS);

  const handleSetPrimary = (paymentMethodId: number) => {
    setPaymentMethods((previousPaymentMethods) =>
      previousPaymentMethods.map((paymentMethod) => ({
        ...paymentMethod,
        isPrimary: paymentMethod.id === paymentMethodId,
      })),
    );
  };

  return (
    <section className="max-w-[960px]">
      <MyPageHeader
        title="결제수단 관리"
        titleVariant="heading-1"
        titleWeight="bold"
      />

      <div className="space-y-5">
        <div className="grid gap-4 xl:grid-cols-2">
          {paymentMethods.map((paymentMethod) => (
            <PaymentMethodCard
              key={paymentMethod.id}
              {...paymentMethod}
              onSetPrimary={handleSetPrimary}
            />
          ))}
        </div>

        <AddPaymentMethodButton />
      </div>
    </section>
  );
}
