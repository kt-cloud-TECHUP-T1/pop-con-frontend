'use client';

import { useState } from 'react';
import {
  PaymentMethodCard,
  type PaymentMethod,
} from '@/app/(protected)/mypage/info/payment-methods/components/payment-method-card';
import { Icon } from '@/components/Icon/Icon';
import { Typography } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { GrpcErrorCode, isIssueBillingKeyError } from '@portone/browser-sdk/v2';
import { requestBillingKey } from '@/app/api/payment/request-billing-key';
import { getBillingList } from '@/app/api/payment/get-billing-list';
import {
  useAuthStore,
  type BillingCard,
} from '@/features/auth/stores/auth-store';
import { snackbar } from '@/components/ui/snackbar';
import { API_ERROR_CODES } from '@/constants/api';

function billingCardToPaymentMethod(card: BillingCard): PaymentMethod {
  return {
    id: card.id,
    brandCode: card.cardName,
    brand: card.cardName,
    maskedNumber: card.cardNumber,
    isPrimary: card.isDefault,
  };
}

type PaymentMethodsPageClientProps = {
  initialPaymentMethods: PaymentMethod[];
};

export function PaymentMethodsPageClient({
  initialPaymentMethods,
}: PaymentMethodsPageClientProps) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(
    initialPaymentMethods
  );
  const accessToken = useAuthStore((state) => state.accessToken);
  const clearAccessToken = useAuthStore((state) => state.clearAccessToken);

  const handleRegisterClick = async () => {
    if (!accessToken) {
      snackbar.destructive({
        title: '인증 오류',
        description: '로그인 정보가 없습니다. 다시 로그인해주세요.',
      });
      return;
    }

    try {
      const billingKey = await requestBillingKey();

      // 사용자가 취소한 경우 — 스낵바 없이 종료
      if (billingKey === undefined) {
        return;
      }

      const response = await fetch(`/api/billing/keys`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          customerUid: billingKey,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.code === 'A002' || data.code === 'A003') {
          clearAccessToken();

          snackbar.destructive({
            title: '세션 만료',
            description: '로그인이 만료되었습니다. 다시 로그인해주세요.',
          });
          return;
        }

        if (data.code === API_ERROR_CODES.COMMON.BAD_REQUEST) {
          snackbar.destructive({
            title: '등록 실패',
            description: '빌링키 정보가 올바르지 않습니다.',
          });
          return;
        }

        snackbar.destructive({
          title: '등록 실패',
          description: '결제수단 등록 중 오류가 발생했습니다.',
        });
        return;
      }

      const billingCards: BillingCard[] = await getBillingList(accessToken);
      setPaymentMethods(billingCards.map(billingCardToPaymentMethod));

      snackbar.success({
        title: '등록 완료',
        description: '결제수단이 등록되었습니다.',
      });
    } catch (error) {
      // 포트원 팝업이 강제로 닫힌 경우 (Cancelled) — 스낵바 없이 종료
      if (
        isIssueBillingKeyError(error) &&
        error.code === GrpcErrorCode.Cancelled
      ) {
        return;
      }

      console.error(
        '[PaymentMethodsPageClient] billing register failed:',
        error
      );
      snackbar.destructive({
        title: '등록 실패',
        description: '결제수단 등록 중 오류가 발생했습니다.',
      });
    }
  };

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

      <Button size="large" variant="tertiary" onClick={handleRegisterClick}>
        <Icon name="Plus" size={20} />
        <Typography variant="label-1" weight="medium">
          새 결제수단 등록
        </Typography>
      </Button>
    </div>
  );
}
