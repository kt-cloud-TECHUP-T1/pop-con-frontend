'use client';

import { useState } from 'react';
import { AddPaymentMethodButton } from '@/app/(protected)/mypage/info/payment-methods/components/add-payment-method-button';
import { PaymentMethodCard } from '@/app/(protected)/mypage/info/payment-methods/components/payment-method-card';
import type { PaymentMethod } from '@/features/mypage/types/payment-method';

type PaymentMethodsPageClientProps = {
  initialPaymentMethods: PaymentMethod[];
};

export function PaymentMethodsPageClient({
  initialPaymentMethods,
}: PaymentMethodsPageClientProps) {
  const [paymentMethods, setPaymentMethods] =
    useState<PaymentMethod[]>(initialPaymentMethods);

  const handleSetPrimary = (paymentMethodId: number) => {
    setPaymentMethods((previousPaymentMethods) =>
      previousPaymentMethods.map((paymentMethod) => ({
        ...paymentMethod,
        isPrimary: paymentMethod.id === paymentMethodId,
      }))
    );
  };

  const handleDelete = (paymentMethodId: number) => {
    setPaymentMethods((previousPaymentMethods) =>
      previousPaymentMethods.filter(
        (paymentMethod) => paymentMethod.id !== paymentMethodId
      )
    );
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 xl:grid-cols-2">
        {paymentMethods.map((paymentMethod) => (
          <PaymentMethodCard
            key={paymentMethod.id}
            {...paymentMethod}
            onSetPrimary={handleSetPrimary}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <AddPaymentMethodButton />
    </div>
  );
}
