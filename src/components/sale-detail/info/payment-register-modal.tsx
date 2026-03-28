'use client';

import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { usePaymentRegisterModalStore } from '@/features/auth/stores/payment-register-modal-store';

export default function PaymentRegisterModal() {
  const isOpen = usePaymentRegisterModalStore((state) => state.isOpen);
  const close = usePaymentRegisterModalStore((state) => state.close);

  if (!isOpen) return null;

  const handleRegisterClick = async () => {
    // 포트원 SDK 호출
    // 성공 시 상태 갱신
    // 모달 닫기
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-[360px] rounded-[20px] bg-white px-5 pt-6 pb-5 shadow-lg">
        <div className="flex flex-col items-center text-center">
          <Typography variant="heading-2" weight="bold">
            간편결제
          </Typography>

          <Typography
            variant="body-2"
            className="mt-6 whitespace-pre-line text-[var(--content-low)]"
          >
            {`경매 참여하기 위해\n간편결제를 등록해야 합니다.`}
          </Typography>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <Button
            size="large"
            variant="secondary"
            className="w-full"
            onClick={handleRegisterClick}
          >
            <Typography variant="label-1">간편결제 등록하기</Typography>
          </Button>

          <Button
            size="large"
            variant="primary"
            className="w-full"
            onClick={close}
          >
            <Typography variant="label-1">확인</Typography>
          </Button>
        </div>
      </div>
    </div>
  );
}
