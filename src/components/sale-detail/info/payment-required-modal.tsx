'use client';

import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { usePaymentRegisterModalStore } from '@/features/auth/stores/payment-register-modal-store';
import { usePaymentRequiredModalStore } from '@/features/auth/stores/payment-required-modal-store';

export default function PaymentRequiredModal() {
  const isOpen = usePaymentRequiredModalStore((state) => state.isOpen);
  const close = usePaymentRequiredModalStore((state) => state.close);

  const openPaymentRegisterModal = usePaymentRegisterModalStore(
    (state) => state.open
  );

  const handleRegisterClick = () => {
    close();
    openPaymentRegisterModal();
  };

  if (!isOpen) return null;

  return (
    <Box className="fixed inset-0 flex items-center justify-center  ">
      <Box radius="LG" className="py-s bg-[var(--bg-default)] w-[480px]">
        <div className="flex flex-col items-center gap-xs py-s px-ms">
          <Typography variant="title-1" weight="bold">
            등록된 카드가 없습니다.
          </Typography>
          <Typography
            variant="body-1"
            weight="regular"
            className="text-[var(--content-extra-low)]"
          >
            간편결제를 등록해야 경매에 참여할 수 있습니다.
          </Typography>
        </div>
        <div className="flex gap-xs py-s px-ms">
          <Button variant="secondary" className="flex-1" onClick={close}>
            <Typography variant="label-1">취소</Typography>
          </Button>
          <Button className="flex-1" onClick={handleRegisterClick}>
            <Typography variant="label-1">등록하기</Typography>
          </Button>
        </div>
      </Box>
    </Box>
  );
}
