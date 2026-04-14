'use client';

import PortOne, {
  GrpcErrorCode,
  isIdentityVerificationError,
} from '@portone/browser-sdk/v2';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { snackbar } from '@/components/ui/snackbar';
import { AUTH_ERROR_CODES, AUTH_MESSAGES } from '@/constants/auth';
import { API_ERROR_CODES, API_MESSAGES } from '@/constants/api';
import { authFetch } from '@/app/(protected)/mypage/lib/auth-fetch';

const PHONE_CHANGE_ERROR_SNACKBAR: Record<
  string,
  { title: string; description?: string }
> = {
  [API_ERROR_CODES.COMMON.BAD_REQUEST]: {
    title: API_MESSAGES.COMMON.INVALID_INPUT,
    description: AUTH_MESSAGES.IDENTITY.ERROR.REQUIRED_ID,
  },
  [AUTH_ERROR_CODES.PORTONE.FETCH_FAILED]: {
    title: '본인인증 정보 조회에 실패했습니다.',
    description: '다시 본인인증을 진행해주세요.',
  },
  [AUTH_ERROR_CODES.PORTONE.VERIFY_FAILED]: {
    title: '본인 명의의 휴대폰 번호로만 변경할 수 있습니다.',
    description: '다시 본인인증을 진행해주세요.',
  },
  [AUTH_ERROR_CODES.USER.DUPLICATE_PHONE]: {
    title: '이미 사용중인 휴대폰 번호입니다.',
  },
  [AUTH_ERROR_CODES.AUTH.INVALID_AUTH]: {
    title: AUTH_MESSAGES.IDENTITY.ERROR.INVALID_AUTH,
    description: '다시 로그인 후 시도해주세요.',
  },
  [AUTH_ERROR_CODES.AUTH.LOGIN_REQUIRED]: {
    title: '인증이 만료되었습니다.',
    description: '다시 로그인 후 시도해주세요.',
  },
};

const storeId = process.env.NEXT_PUBLIC_PORTONE_STORE_ID;
const channelKey = process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY;

function createIdentityVerificationId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `identity-verification-${crypto.randomUUID()}`;
  }
  return `identity-verification-${Date.now()}-${Math.random()}`;
}

export function usePhoneChange() {
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);

  const handleClickPhoneChange = async () => {
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

      if (response === undefined) {
        return;
      }

      if (response.code !== undefined) {
        snackbar.informative({
          title: '본인인증에 실패했습니다.',
          description: response.message ?? '다시 시도해주세요.',
        });
        return;
      }

      if (!response.identityVerificationId) {
        snackbar.destructive({
          title: '본인인증 결과를 확인할 수 없습니다.',
          description: '다시 시도해주세요.',
        });
        return;
      }

      const phoneChangeResponse = await authFetch(
        '/api/auth/identity/phone-change',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            identityVerificationId: response.identityVerificationId,
          }),
        }
      );

      const result = await phoneChangeResponse.json();

      if (!phoneChangeResponse.ok) {
        if (result.code === API_ERROR_CODES.SYSTEM.INTERNAL_SERVER_ERROR) {
          snackbar.destructive({
            title: '휴대폰 번호 변경에 실패했습니다.',
            description: result.message ?? '잠시 후 다시 시도해주세요.',
          });
          return;
        }

        const errorEntry = PHONE_CHANGE_ERROR_SNACKBAR[result.code];
        if (errorEntry) {
          snackbar.destructive(errorEntry);
          return;
        }

        snackbar.destructive({
          title: '휴대폰 번호 변경에 실패했습니다.',
          description: result.message ?? '잠시 후 다시 시도해주세요.',
        });
        console.error(result.message);
        return;
      }

      snackbar.success({
        title: '휴대폰 번호가 성공적으로 변경되었습니다.',
      });
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
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

  return { handleClickPhoneChange, isPending };
}
