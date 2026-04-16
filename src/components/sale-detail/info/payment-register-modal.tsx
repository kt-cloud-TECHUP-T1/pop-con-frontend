'use client';

import { getBillingList } from '@/app/api/payment/get-billing-list';
import { requestBillingKey } from '@/app/api/payment/request-billing-key';
import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { PaymentAvatar } from '@/components/ui/avatar/payment';
import { snackbar } from '@/components/ui/snackbar';
import { Typography } from '@/components/ui/typography';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import { usePaymentRegisterModalStore } from '@/features/auth/stores/payment-register-modal-store';
import { cn } from '@/lib/utils';

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, '') ?? '';

export default function PaymentRegisterModal() {
  const isOpen = usePaymentRegisterModalStore((state) => state.isOpen);
  const close = usePaymentRegisterModalStore((state) => state.close);
  const accessToken = useAuthStore((state) => state.accessToken);
  const setBillingCards = useAuthStore((state) => state.setBillingCards);
  const clearAccessToken = useAuthStore((state) => state.clearAccessToken);
  const billingCards = useAuthStore((state) => state.billingCards);
  const isPaymentRegistered = useAuthStore(
    (state) => state.isPaymentRegistered
  );

  if (!isOpen) return null;

  const handleRegisterClick = async () => {
    // 포트원 SDK 호출
    // 성공 시 상태 갱신

    if (!accessToken) {
      snackbar.destructive({
        title: '인증 오류',
        description: '로그인 정보가 없습니다. 다시 로그인해주세요.',
      });
      return;
    }

    try {
      // 1. 빌링키 받아오기
      const billingKey = await requestBillingKey();

      // 2. 빌링키 등록 route.ts 호출
      const res = await fetch(`${BASE_URL}/billing/keys`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          customerUid: billingKey,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.code === 'P006') {
          snackbar.destructive({
            title: '등록 실패',
            description: '이미 등록된 결제 수단입니다.',
          });
          return;
        }

        throw new Error(data.message || '빌링키 등록 실패');
      }

      // 3. 간편결제 리스트 조회
      const billingCards = await getBillingList(accessToken);

      // 4. 조회 리스트를 store에 저장해서 화면 반영
      setBillingCards(billingCards);

      snackbar.success({
        title: '등록 완료',
        description: '간편결제 수단이 등록되었습니다.',
      });
    } catch (error: unknown) {
      console.error('[PaymentRegisterModal] billing register failed:', error);

      const errorCode = error instanceof Error ? error.message : 'UNKNOWN';

      if (errorCode === 'A002' || errorCode === 'A003') {
        clearAccessToken();

        snackbar.destructive({
          title: '세션 만료',
          description: '로그인이 만료되었습니다. 다시 로그인해주세요.',
        });

        close();
        return;
      }

      if (errorCode === 'C001') {
        snackbar.destructive({
          title: '등록 실패',
          description: '빌링키 정보가 올바르지 않습니다.',
        });
        return;
      }

      if (errorCode === 'P001') {
        snackbar.destructive({
          title: '등록 실패',
          description: '결제 수단 정보 조회에 실패했습니다.',
        });
        return;
      }

      if (errorCode === 'P006') {
        snackbar.destructive({
          title: '등록 실패',
          description: '이미 등록된 결제 수단입니다.',
        });
        return;
      }

      snackbar.destructive({
        title: '등록 실패',
        description: '간편결제 등록 중 오류가 발생했습니다.',
      });
    } finally {
    }
  };

  const handleSelectDefaultCard = async (
    cardId: number,
    isDefault: boolean
  ) => {
    if (isDefault) return;
    if (!accessToken) {
      snackbar.destructive({
        title: '인증 오류',
        description: '로그인 정보가 없습니다. 다시 로그인해주세요.',
      });
      return;
    }

    try {
      const res = await fetch(`/api/billing/keys/${cardId}/default`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.code || '대표카드 변경 실패');
      }

      const updatedCards = await getBillingList(accessToken);
      setBillingCards(updatedCards);

      snackbar.success({
        title: '변경 완료',
        description: '대표카드가 변경되었습니다.',
      });
    } catch (error) {
      console.error(
        '[PaymentRegisterModal] default card change failed:',
        error
      );

      snackbar.destructive({
        title: '변경 실패',
        description: '대표카드 변경 중 오류가 발생했습니다.',
      });
    }
  };

  return (
    <Box className="fixed inset-0 flex items-center justify-center  ">
      <Box
        shadow="M"
        radius="LG"
        className="flex flex-col py-s bg-[var(--bg-default)] w-[480px]"
      >
        <div className="py-s px-ms">
          <Typography variant="title-1" weight="bold">
            간편결제
          </Typography>
        </div>

        {!isPaymentRegistered ? (
          <div className="w-full h-[120px] flex items-center justify-center text-center  ">
            <Typography
              variant="body-2"
              className="text-[var(--content-extra-low)]"
            >
              경매에 참여하기 위해 간편결제를 등록해야 합니다.
            </Typography>
          </div>
        ) : (
          <div className="flex flex-col gap-s py-s px-ms">
            {billingCards.map((card) => (
              <div
                key={card.id}
                onClick={() => handleSelectDefaultCard(card.id, card.isDefault)}
                className={cn(
                  'flex items-center rounded-ml border px-4 py-3 text-left cursor-pointer',
                  card.isDefault
                    ? //나중에 물어보기
                      'border-[var(--orange-50)]'
                    : 'border-[var(--line-3)]'
                )}
              >
                <div className="toggle flex items-center justify-center pr-4">
                  <span
                    className={cn(
                      'flex h-5 w-5 items-center justify-center rounded-full border',
                      card.isDefault
                        ? 'border-[var(--orange-50)]'
                        : 'border-[var(--line-3)]'
                    )}
                  >
                    <span
                      className={cn(
                        'h-2.5 w-2.5 rounded-full',
                        card.isDefault
                          ? 'bg-[var(--orange-50)]'
                          : 'bg-[var(--line-5)]'
                      )}
                    />
                  </span>
                </div>
                <PaymentAvatar
                  brandCode={card.cardName}
                  size="MD"
                  className="mr-4 shrink-0"
                />
                <div className="content flex-1">
                  <div>
                    <Typography variant="label-1" weight="bold">
                      {card.cardName}
                    </Typography>
                  </div>

                  <Typography
                    variant="body-2"
                    className="mt-1 text-[var(--content-medium)]"
                  >
                    {card.cardNumber}
                  </Typography>
                </div>

                {card.isDefault && (
                  <div className="isDefault flex items-center justify-center">
                    <span className="rounded-ml bg-[var(--orange-95)] px-2 py-1 text-xs text-[var(--orange-45)]">
                      대표
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="py-s px-ms">
          <Button
            variant="tertiary"
            className="w-full"
            onClick={handleRegisterClick}
          >
            <Typography variant="label-1">간편결제 등록하기</Typography>
          </Button>
        </div>
        <div className="py-s px-ms">
          <Button className="w-full" onClick={close}>
            <Typography variant="label-1">확인</Typography>
          </Button>
        </div>
      </Box>
    </Box>
  );
}
