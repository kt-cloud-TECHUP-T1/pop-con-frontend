'use client';

import Modal, { ModalBody, ModalFooter } from '@/components/ui/modal';
import { Wrapper } from '@/components/layout/wrapper';
import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { usePortfoneVerify } from '@/features/auth/verify/hooks/use-portone-verify';

// 본인인증 연동 참고 사이트 (SDK v2 기준)
// https://developers.portone.io/opi/ko/extra/identity-verification/readme-v2?v=v2

export default function PortoneAuthClient() {
  const {
    verify,
    isPending,
    isUnder14ModalOpen,
    under14Message,
    closeUnder14Modal,
  } = usePortfoneVerify();

  return (
    // TODO pt-120px 박은 것 유동적으로 바뀌도록 수정이 필요함
    <Wrapper className="pt-[120px]">
      <Typography
        variant="heading-1"
        weight="bold"
        className="text-center mb-10"
      >
        휴대폰 번호로
        <br /> 본인 인증해주세요.
      </Typography>
      <Box
        className="w-full max-w-[360px] bg-[#F35E11] text-center mx-auto"
        radius="MS"
      >
        <button
          type="button"
          onClick={verify}
          disabled={isPending}
          className="cursor-pointer w-full h-full py-3"
        >
          <Typography variant="label-1" className="text-white">
            {isPending ? '처리 중...' : '인증하기'}
          </Typography>
        </button>
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
            메인으로 돌아가기
          </Button>
        </ModalFooter>
      </Modal>
    </Wrapper>
  );
}
