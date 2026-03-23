'use client';

import PortOne from '@portone/browser-sdk/v2';
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

// 본인인증 연동 참고 사이트 (SDK v2 기준)
// https://developers.portone.io/opi/ko/extra/identity-verification/readme-v2?v=v2

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

      if (!response || !response.identityVerificationId) {
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
        // Case 1: C001 입력값 오류
        if (result.code === API_ERROR_CODES.COMMON.BAD_REQUEST) {
          snackbar.destructive({
            title: API_MESSAGES.COMMON.INVALID_INPUT,
            description: AUTH_MESSAGES.IDENTITY.ERROR.REQUIRED_ID,
          });
          return;
        }
        // Case 2: A001 회원가입 세션 만료 / 가입 진행 토큰 누락
        if (result.code === AUTH_ERROR_CODES.AUTH.SESSION_EXPIRED) {
          snackbar.destructive({
            title: '회원가입 세션이 만료되었습니다.',
            description: '처음부터 다시 진행해주세요.',
          });
          return;
        }
        // Case 3: A002 인증 정보가 유효하지 않음(포트원 검증 실패/위변조/조회 불가)
        if (result.code === AUTH_ERROR_CODES.AUTH.INVALID_AUTH) {
          snackbar.destructive({
            title: AUTH_MESSAGES.IDENTITY.ERROR.INVALID_AUTH,
            description: '다시 본인인증을 진행해주세요.',
          });
          return;
        }
        // Case 4: I001 포트원 본인인증 정보 조회 실패
        if (result.code === 'I001') {
          snackbar.destructive({
            title: '본인인증 정보 조회에 실패했습니다.',
            description: '다시 본인인증을 진행해주세요.',
          });
          return;
        }
        // Case 5: I002 본인인증 검증 실패
        if (result.code === 'I002') {
          snackbar.destructive({
            title: '본인인증 검증에 실패했습니다.',
            description: '다시 본인인증을 진행해주세요.',
          });
          return;
        }
        // Case 6: I002 본인인증 검증 실패
        if (result.code === 'E001') {
          snackbar.destructive({
            title: '데이터 암호화에 실패했습니다.',
          });
          return;
        }
        // Case 7: J001 만 14세 미만 가입 제한
        if (result.code === AUTH_ERROR_CODES.JOIN.UNDERAGE) {
          setIsUnder14(true);
          return;
        }
        // Case 8: S001 서버 오류
        if (result.code === API_ERROR_CODES.SYSTEM.INTERNAL_SERVER_ERROR) {
          snackbar.destructive({
            title: '본인인증에 실패했습니다.',
            description: result.message ?? '잠시 후 다시 시도해주세요.',
          });
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
        휴대폰 번호로
        <br /> 본인 인증해주세요.
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
        title="만 14세 이하 가입 제한"
        size="md"
      >
        <ModalBody>만 14세 이하는 가입이 제한 되어있습니다.</ModalBody>
        <ModalFooter onClick={handleUnder14CloseModal}>
          메인으로 돌아가기
        </ModalFooter>
      </Modal>
    </Wrapper>
  );
}
