import { useRouter } from 'next/navigation';
import { requestPortoneIdentityVerification } from '../services/portone';
import { completeIdentityVerification } from '../services/identity';
import { useState } from 'react';
import { API_MESSAGES } from '@/constants/api';
import { setAccessToken } from '@/features/auth/utils/auth-storage';
import { snackbar } from '@/components/ui/snackbar';

type UsePortoneVerifyOptions = {
  disableRedirect?: boolean;
  onVerified?: () => void;
};

export function usePortoneVerify(options?: UsePortoneVerifyOptions) {
  const router = useRouter();
  const disableRedirect = options?.disableRedirect ?? false;
  // 본인인증 요청 중 중복 클릭/호출을 막기 위한 로딩 상태
  const [isPending, setIsPending] = useState(false);
  // 만 14세 미만 가입 제한 안내 모달 상태 및 메시지
  const [isUnder14ModalOpen, setIsUnder14ModalOpen] = useState(false);
  const [under14Message, setUnder14Message] = useState(
    '만 14세 이하는 가입이 제한 되어있습니다.'
  );

  // 만 14세 미만 안내 모달 닫기
  const closeUnder14Modal = () => setIsUnder14ModalOpen(false);

  // 1단계: 포트원 인증 창 호출 및 사용자 인증 결과 확인
  // 실패/취소는 여기서 종료하고, 성공 시 서버 검증에 필요한 ID를 반환
  const handlePortoneStep = async (): Promise<string | null> => {
    const verifyResult = await requestPortoneIdentityVerification();

    if (verifyResult.status === 'cancelled') {
      snackbar.informative({
        title: '본인인증 취소',
        description: '본인인증이 완료되지 않았습니다.',
      });
      return null;
    }

    if (verifyResult.status === 'failed') {
      snackbar.destructive({
        title: '본인인증 실패',
        description: verifyResult.message,
      });
      return null;
    }

    return verifyResult.identityVerificationId;
  };

  // 2단계: 백엔드 인증 완료 처리 결과에 따라 다음 화면/상태 분기
  const handleCompleteStep = async (
    identityVerificationId: string
  ): Promise<void> => {
    const completeResult = await completeIdentityVerification(
      identityVerificationId
    );

    if (completeResult.status === 'under14') {
      setUnder14Message(completeResult.message);
      setIsUnder14ModalOpen(true);
      return;
    }

    if (completeResult.status === 'sessionExpired') {
      snackbar.destructive({
        title: '세션 만료',
        description: completeResult.message,
      });
      return;
    }

    if (completeResult.status === 'failed') {
      snackbar.destructive({
        title: '본인인증 실패',
        description: completeResult.message,
      });
      return;
    }

    if (completeResult.data.isNewUser) {
      if (disableRedirect) {
        options?.onVerified?.();
        return;
      }

      if (completeResult.data.nextStep === 'TERMS') {
        router.push('/signup');
        return;
      }

      if (completeResult.data.nextStep === 'HOME') {
        setAccessToken(completeResult.data.accessToken);
        router.push('/');
        return;
      }

      snackbar.destructive({
        title: '처리 실패',
        description: '다음 단계 정보를 확인할 수 없습니다.',
      });
      return;
    }

    setAccessToken(completeResult.data.accessToken);

    if (disableRedirect) {
      options?.onVerified?.();
      return;
    }

    router.push('/');
  };

  // 예기치 못한 런타임 예외를 공통 에러 메시지로 처리
  const handleUnexpectedError = (error: unknown) => {
    const message =
      error instanceof Error
        ? error.message
        : API_MESSAGES.COMMON.SERVER_ERROR;

    snackbar.destructive({
      title: '오류 발생',
      description: message,
    });
  };

  // 전체 인증 흐름 오케스트레이션:
  // 중복 실행 방지 -> 포트원 인증 -> 서버 완료 처리 -> 로딩 해제
  const verify = async () => {
    if (isPending) return;
    setIsPending(true);

    try {
      const identityVerificationId = await handlePortoneStep();
      if (!identityVerificationId) return;

      await handleCompleteStep(identityVerificationId);
    } catch (error) {
      handleUnexpectedError(error);
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
