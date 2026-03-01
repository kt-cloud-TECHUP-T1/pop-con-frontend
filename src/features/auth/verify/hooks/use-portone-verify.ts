// 클릭 핸들러, 에러 처리, 분기

import { useRouter } from 'next/navigation';
import { requsetPortfoneIdentityVerification } from '../services/portone';
import { completeIdentityVertification } from '../services/identity';
import { useState } from 'react';
import { AUTH_MESSAGES } from '@/constants/auth';
import { setAuthTokens } from '@/features/auth/utils/auth-storage';

const REGISTER_TOKEN_STORAGE_KEY = 'registerToken';

export function usePortfoneVerify() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [isUnder14ModalOpen, setIsUnder14ModalOpen] = useState(false);
  const [under14Message, setUnder14Message] = useState(
    '만 14세 이하는 가입이 제한 되어있습니다.'
  );

  const closeUnder14Modal = () => setIsUnder14ModalOpen(false);

  const verify = async () => {
    if (isPending) return;
    setIsPending(true);

    try {
      const verifyResult = await requsetPortfoneIdentityVerification();

      if (verifyResult.status === 'cancelled') {
        alert('본인인증이 완료되지 않았습니다.');
        return;
      }

      if (verifyResult.status === 'failed') {
        alert(verifyResult.message);
        return;
      }

      const completeResult = await completeIdentityVertification(
        verifyResult.identityVerificationId,
        localStorage.getItem(REGISTER_TOKEN_STORAGE_KEY) ?? ''
      );

      if (completeResult.status === 'under14') {
        setUnder14Message(completeResult.message);
        setIsUnder14ModalOpen(true);
        return;
      }

      if (completeResult.status === 'failed') {
        alert(completeResult.message);
        return;
      }

      if (completeResult.data.isNewUser && completeResult.data.nextStep === 'TERMS') {
        router.push('/signup');
        return;
      }

      if (!completeResult.data.isNewUser) {
        setAuthTokens({
          accessToken: completeResult.data.accessToken,
          refreshToken: completeResult.data.refreshToken,
        });
        localStorage.removeItem(REGISTER_TOKEN_STORAGE_KEY);
        router.push('/');
        return;
      }

      alert('다음 단계 정보를 확인할 수 없습니다.');
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : AUTH_MESSAGES.COMMON.ERROR.SERVER_ERROR;

      alert(message);
    } finally {
      setIsPending(false);
    }
  };

  return {
    verify,
    isPending,
    isUnder14ModalOpen,
    under14Message,
    closeUnder14Modal,
  };
}
