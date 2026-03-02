import { useRouter } from 'next/navigation';
import { requestPortoneIdentityVerification } from '../services/portone';
import { completeIdentityVertification } from '../services/identity';
import { useState } from 'react';
import { AUTH_MESSAGES } from '@/constants/auth';
import { setAccessToken } from '@/features/auth/utils/auth-storage';

const REGISTER_TOKEN_STORAGE_KEY = 'registerToken';
const FALLBACK_REGISTER_TOKEN = 'register_from_social_login';

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
      const verifyResult = await requestPortoneIdentityVerification();

      if (verifyResult.status === 'cancelled') {
        alert('본인인증이 완료되지 않았습니다.');
        return;
      }

      if (verifyResult.status === 'failed') {
        alert(verifyResult.message);
        return;
      }

      // TODO: 소셜 로그인 callback에서 신규회원 응답으로 받은 registerToken을 여기서 사용하도록 교체
      // 현재는 소셜 로그인 로직이 아직 없어 본인인증 플로우를 이어가기 위한 임시 fallback
      const registerToken =
        localStorage.getItem(REGISTER_TOKEN_STORAGE_KEY) ??
        FALLBACK_REGISTER_TOKEN;

      const completeResult = await completeIdentityVertification(
        verifyResult.identityVerificationId,
        registerToken
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

      if (
        completeResult.data.isNewUser &&
        completeResult.data.nextStep === 'TERMS'
      ) {
        // 회원가입 연결 포인트: 본인인증을 마친 신규회원은 registerToken으로 signup 단계로 이어짐
        router.push('/signup');
        return;
      }

      if (!completeResult.data.isNewUser) {
        // 로그인 연결 포인트: 기존회원 세션 처리는 추후 로그인 담당 구현에 맞춰 재연결
        // 현재는 refresh token 저장 없이 access token만 임시 저장
        setAccessToken(completeResult.data.accessToken);
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
