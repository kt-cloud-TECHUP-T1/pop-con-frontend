'use client';

import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import Modal, { ModalBody, ModalFooter } from '@/components/ui/modal';
import { Typography } from '@/components/ui/typography';
import { usePortoneVerify } from '@/features/auth/verify/hooks/use-portone-verify';

export function PersonalPhoneVerifyAction() {
  const {
    verify,
    isPending,
    isUnder14ModalOpen,
    under14Message,
    closeUnder14Modal,
  } = usePortoneVerify();

  return (
    <>
      <Box
        as="button"
        type="button"
        paddingY="S"
        paddingX="M"
        border="#0A0A0A29"
        radius="MS"
        onClick={verify}
        disabled={isPending}
      >
        <Typography variant="label-1" weight="medium" className="whitespace-nowrap">
          {isPending ? '처리 중...' : '변경'}
        </Typography>
      </Box>

      <Modal
        isOpen={isUnder14ModalOpen}
        onClose={closeUnder14Modal}
        title="만 14세 이하 가입 제한"
        size="sm"
      >
        <ModalBody>{under14Message}</ModalBody>
        <ModalFooter className="justify-center">
          <Button onClick={closeUnder14Modal} variant="primary" size="medium">
            확인
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
