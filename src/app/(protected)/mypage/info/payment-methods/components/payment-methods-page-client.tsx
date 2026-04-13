'use client';

import { useState, useEffect, useCallback } from 'react';
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

export function PaymentMethodsPageClient() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const accessToken = useAuthStore((state) => state.accessToken);
  const clearAccessToken = useAuthStore((state) => state.clearAccessToken);

  const handleAuthError = useCallback(
    (data: { code?: string }) => {
      if (data.code === 'A002' || data.code === 'A003') {
        clearAccessToken();
        snackbar.destructive({
          title: '세션 만료',
          description: '로그인이 만료되었습니다. 다시 로그인해주세요.',
        });
        return true;
      }
      return false;
    },
    [clearAccessToken]
  );

  const fetchBillingList = useCallback(async () => {
    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    try {
      const billingCards: BillingCard[] = await getBillingList(accessToken);
      setPaymentMethods(billingCards.map(billingCardToPaymentMethod));
    } catch (error) {
      // 인증 오류인 경우 세션 만료 처리
      if (error instanceof Error && handleAuthError({ code: error.message })) {
        return;
      }

      console.error(
        '[PaymentMethodsPageClient] fetch billing list failed:',
        error
      );
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchBillingList();
  }, [fetchBillingList]);

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
        if (handleAuthError(data)) return;

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

  const handleSetPrimary = async (paymentMethodId: number) => {
    if (!accessToken) return;

    try {
      const response = await fetch(
        `/api/billing/keys/${paymentMethodId}/default`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (handleAuthError(data)) return;

        snackbar.destructive({
          title: '변경 실패',
          description: '주 결제수단 변경 중 오류가 발생했습니다.',
        });
        return;
      }

      setPaymentMethods((prev) =>
        prev.map((pm) => ({
          ...pm,
          isPrimary: pm.id === paymentMethodId,
        }))
      );

      snackbar.success({
        title: '변경 완료',
        description: '주 결제수단이 변경되었습니다.',
      });
    } catch (error) {
      console.error('[PaymentMethodsPageClient] set primary failed:', error);
      snackbar.destructive({
        title: '변경 실패',
        description: '주 결제수단 변경 중 오류가 발생했습니다.',
      });
    }
  };

  const handleDelete = async (paymentMethodId: number) => {
    if (!accessToken) return;

    try {
      const response = await fetch(`/api/billing/keys/${paymentMethodId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (handleAuthError(data)) return;

        snackbar.destructive({
          title: '삭제 실패',
          description: '결제수단 삭제 중 오류가 발생했습니다.',
        });
        return;
      }

      setPaymentMethods((prev) =>
        prev.filter((pm) => pm.id !== paymentMethodId)
      );

      snackbar.success({
        title: '삭제 완료',
        description: '결제수단이 삭제되었습니다.',
      });
    } catch (error) {
      console.error('[PaymentMethodsPageClient] delete failed:', error);
      snackbar.destructive({
        title: '삭제 실패',
        description: '결제수단 삭제 중 오류가 발생했습니다.',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Typography variant="body-2" className="text-[var(--neutral-50)]">
          결제수단을 불러오는 중...
        </Typography>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {paymentMethods.length === 0 ? (
        <div className="flex justify-center py-10">
          <Typography variant="body-2" className="text-[var(--neutral-50)]">
            등록된 결제수단이 없습니다.
          </Typography>
        </div>
      ) : (
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
      )}

      <Button size="large" variant="tertiary" onClick={handleRegisterClick}>
        <Icon name="Plus" size={20} />
        <Typography variant="label-1" weight="medium">
          새 결제수단 등록
        </Typography>
      </Button>
    </div>
  );
}
