'use client';

import PortOne, {
  GrpcErrorCode,
  isIdentityVerificationError,
} from '@portone/browser-sdk/v2';
import { Wrapper } from '@/components/layout/wrapper';
import { Box } from '@/components/ui/box';
import { snackbar } from '@/components/ui/snackbar';
import { Typography } from '@/components/ui/typography';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import { AUTH_ERROR_CODES, AUTH_MESSAGES } from '@/constants/auth';
import Modal, { ModalBody, ModalFooter } from '@/components/ui/modal';
import { API_ERROR_CODES, API_MESSAGES } from '@/constants/api';
import { Button } from '@/components/ui/button';

// 본인인증 연동 참고 사이트 (SDK v2 기준)
// https://developers.portone.io/opi/ko/extra/identity-verification/readme-v2?v=v2

// 본인인증 완료 API 에러 코드 → 스낵바 메시지 매핑
// J001(만 14세 미만)과 S001(서버 오류)은 별도 처리되므로 여기 포함하지 않음
const IDENTITY_COMPLETE_ERROR_SNACKBAR: Record<
  string,
  { title: string; description?: string }
> = {
  [API_ERROR_CODES.COMMON.BAD_REQUEST]: {
    title: API_MESSAGES.COMMON.INVALID_INPUT,
    description: AUTH_MESSAGES.IDENTITY.ERROR.REQUIRED_ID,
  },
  [AUTH_ERROR_CODES.AUTH.SESSION_EXPIRED]: {
    title: '회원가입 세션이 만료되었습니다.',
    description: '처음부터 다시 진행해주세요.',
  },
  [AUTH_ERROR_CODES.AUTH.INVALID_AUTH]: {
    title: AUTH_MESSAGES.IDENTITY.ERROR.INVALID_AUTH,
    description: '다시 본인인증을 진행해주세요.',
  },
  [AUTH_ERROR_CODES.PORTONE.FETCH_FAILED]: {
    title: '본인인증 정보 조회에 실패했습니다.',
    description: '다시 본인인증을 진행해주세요.',
  },
  [AUTH_ERROR_CODES.PORTONE.VERIFY_FAILED]: {
    title: '본인인증 검증에 실패했습니다.',
    description: '다시 본인인증을 진행해주세요.',
  },
  [AUTH_ERROR_CODES.PORTONE.ENCRYPT_FAILED]: {
    title: '데이터 암호화에 실패했습니다.',
  },
};

const storeId = process.env.NEXT_PUBLIC_PORTONE_STORE_ID;
const channelKey = process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY;

// 팝업 호출하는 프론트에서 아이디 값을 생성해 포트원에 요청
function createIdentityVerificationId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `identity-verification-${crypto.randomUUID()}`;
  }

  return `identity-verification-${Date.now()}-${Math.random()}`;
}

export default function PortoneAuthClient() {
  const [isPending, setIsPending] = useState(false);
  const [isUnder14, setIsUnder14] = useState(false);
  const router = useRouter();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  // 포트원 팝업 호출
  const handleClickVerify = async () => {
    if (!storeId || !channelKey) {
      snackbar.destructive({
        title: '현재 본인인증을 진행할 수 없습니다.',
        description: '잠시 후 다시 시도해주세요.',
      });
      console.error('포트원 설정값이 없습니다.');
      return;
    }

    try {
      setIsPending(true);

      const response = await PortOne.requestIdentityVerification({
        storeId,
        channelKey,
        identityVerificationId: createIdentityVerificationId(),
      });

      // 사용자가 팝업을 닫거나 취소한 경우
      if (response === undefined) {
        return;
      }

      // code가 있으면 실패 케이스 (취소 포함 일부 PG는 여기서 처리될 수도 있음)
      if (response.code !== undefined) {
        snackbar.informative({
          title: '본인인증이 취소되었습니다.',
          description: response.message ?? '다시 시도해주세요.',
        });
        return;
      }

      // identityVerificationId 없는 경우 (방어 코드)
      if (!response.identityVerificationId) {
        snackbar.destructive({
          title: '본인인증 결과를 확인할 수 없습니다.',
          description: '다시 시도해주세요.',
        });
        return;
      }

      const identityVerificationId = response.identityVerificationId;

      const completeResponse = await fetch('/api/auth/identity/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identityVerificationId,
        }),
      });

      const result = await completeResponse.json();

      // HTTP 요청이 실패했는지 확인
      if (!completeResponse.ok) {
        // J001: 만 14세 미만 → 모달 표시
        if (result.code === AUTH_ERROR_CODES.JOIN.UNDERAGE) {
          setIsUnder14(true);
          return;
        }

        // S001: 서버 오류 → 동적 메시지 포함
        if (result.code === API_ERROR_CODES.SYSTEM.INTERNAL_SERVER_ERROR) {
          snackbar.destructive({
            title: '본인인증에 실패했습니다.',
            description: result.message ?? '잠시 후 다시 시도해주세요.',
          });
          return;
        }

        const errorEntry = IDENTITY_COMPLETE_ERROR_SNACKBAR[result.code];
        if (errorEntry) {
          snackbar.destructive(errorEntry);
          return;
        }

        console.error(result.message);
        return;
      }
      // 응답은 성공했으나 실제 데이터가 비어있는지 확인
      if (!result.data) {
        snackbar.destructive({
          title: '본인인증 결과를 확인할 수 없습니다.',
          description: '다시 시도해주세요.',
        });
        return;
      }
      // 기존/신규 회원 분기 처리
      if (result.data.isNewUser) {
        if (result.data.nextStep === 'TERMS') {
          router.push('/signup');
          return;
        }

        snackbar.destructive({
          title: '다음 가입 단계를 확인할 수 없습니다.',
          description: '잠시 후 다시 시도해주세요.',
        });
        return;
      } else {
        if (typeof result.data.userId === 'number' && result.data.accessToken) {
          setAccessToken(result.data.accessToken);
          router.push('/');
          return;
        }

        snackbar.destructive({
          title: '로그인 정보를 확인할 수 없습니다.',
          description: '잠시 후 다시 시도해주세요.',
        });
        return;
      }
    } catch (error) {
      if (
        isIdentityVerificationError(error) &&
        error.code === GrpcErrorCode.Cancelled
      ) {
        return;
      }

      snackbar.destructive({
        title: '본인인증 중 문제가 발생했습니다.',
        description: '잠시 후 다시 시도해주세요.',
      });
      console.error(error);
    } finally {
      setIsPending(false);
    }
  };

  // 14세 미만 모달 호출
  const handleUnder14CloseModal = () => {
    setIsUnder14(false);
    router.push('/');
  };

  return (
    <Wrapper className="flex min-h-screen flex-col justify-start pb-24 pt-[120px]">
      <Typography
        variant="heading-1"
        weight="bold"
        className="text-center mb-10"
      >
        회원가입을 위해
        <br /> 본인 인증이 필요해요
      </Typography>
      <Box
        className="w-full max-w-[360px] bg-[#F35E11] text-center mx-auto"
        radius="MS"
      >
        <button
          type="button"
          className="cursor-pointer w-full h-full py-3"
          onClick={handleClickVerify}
          disabled={isPending}
        >
          <Typography variant="label-1" className="text-white">
            {isPending ? '처리 중...' : '인증하기'}
          </Typography>
        </button>
      </Box>
      <Modal
        isOpen={isUnder14}
        onClose={() => setIsUnder14(false)}
        showClose={false}
        title="연령 확인이 필요해요"
        size="md"
      >
        <ModalBody>팝콘은 만 14세 이상부터 이용할 수 있는 서비스예요</ModalBody>
        <ModalFooter>
          <Button
            variant="primary"
            className="w-full"
            size="large"
            onClick={handleUnder14CloseModal}
          >
            메인으로 돌아가기
          </Button>
        </ModalFooter>
      </Modal>
    </Wrapper>
  );
}
