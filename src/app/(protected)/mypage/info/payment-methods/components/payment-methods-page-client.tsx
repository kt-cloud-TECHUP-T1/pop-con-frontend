'use client';

import { useState } from 'react';
import {
  PaymentMethodCard,
  type PaymentMethod,
} from '@/app/(protected)/mypage/info/payment-methods/components/payment-method-card';
import { Icon } from '@/components/Icon/Icon';
import { Typography } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';

type PaymentMethodsPageClientProps = {
  initialPaymentMethods: PaymentMethod[];
};

export function PaymentMethodsPageClient({
  initialPaymentMethods,
}: PaymentMethodsPageClientProps) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(
    initialPaymentMethods
  );

  const handleSetPrimary = (paymentMethodId: number) => {
    setPaymentMethods((prev) =>
      prev.map((paymentMethod) => ({
        ...paymentMethod,
        isPrimary: paymentMethod.id === paymentMethodId,
      }))
    );
  };

  const handleDelete = (paymentMethodId: number) => {
    setPaymentMethods((previous) =>
      previous.filter((paymentMethod) => paymentMethod.id !== paymentMethodId)
    );
  };

  return (
    <div className="space-y-4">
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

      <Button size="large" variant="tertiary">
        <Icon name="Plus" size={20} />
        <Typography variant="label-1" weight="medium">
          새 결제수단 등록
        </Typography>
      </Button>
    </div>
  );
}
