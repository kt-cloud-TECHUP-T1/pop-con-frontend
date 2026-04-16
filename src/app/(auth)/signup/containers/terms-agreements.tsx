'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AllAgreeCheckbox from '../components/all-agree-checkbox';
import AgreementCheckbox from '../components/agreement-checkbox';
import SignupButton from '../components/signup-button';
import { Separator } from '@/components/ui/separator';
import { snackbar } from '@/components/ui/snackbar';
import { AUTH_ERROR_CODES, AUTH_MESSAGES, TERMS } from '@/constants/auth';
import { API_ERROR_CODES, API_MESSAGES } from '@/constants/api';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import { TermsContent } from '../components/terms-detail-content';
import ageContent from '../_data/terms/age.json';
import privacyContent from '../_data/terms/privacy.json';
import termsContent from '../_data/terms/terms.json';
import marketingContent from '../_data/terms/marketing.json';

const TERMS_DETAIL_MAP: Record<string, TermsContent> = {
  age: ageContent as TermsContent,
  privacy: privacyContent as TermsContent,
  terms: termsContent as TermsContent,
  marketing: marketingContent as TermsContent,
};

const initialTerms = TERMS.map((term) => ({ ...term, isAgreed: false }));

// 회원가입 API 에러 코드 → 스낵바 메시지 매핑
// C001과 S001은 별도 처리되므로 여기 포함하지 않음 (동적 메시지)
const SIGNUP_ERROR_SNACKBAR: Record<
  string,
  { title: string; description?: string }
> = {
  [AUTH_ERROR_CODES.JOIN.ALREADY_COMPLETED]: {
    title: API_MESSAGES.COMMON.INVALID_INPUT,
    description: AUTH_MESSAGES.TERMS.ERROR.ALREADY_REGISTERED,
  },
  [AUTH_ERROR_CODES.AUTH.SESSION_EXPIRED]: {
    title: '회원가입 세션이 만료되었습니다.',
    description: '다시 가입 절차를 진행해주세요.',
  },
  [AUTH_ERROR_CODES.AUTH.INVALID_AUTH]: {
    title: '인증 정보가 유효하지 않습니다.',
    description: '다시 가입 절차를 진행해주세요.',
  },
  [AUTH_ERROR_CODES.USER.MISSING_SOCIAL_INFO]: {
    title: '가입 세션의 소셜 정보가 누락되었습니다.',
    description: '다시 가입 절차를 진행해주세요.',
  },
};

export default function TermsAgreements() {
  const [terms, setTerms] = useState(initialTerms);
  const [isPending, setIsPending] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const router = useRouter();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setPaymentRegistered = useAuthStore(
    (state) => state.setPaymentRegistered
  );

  const isAllAgreed = terms.every((term) => term.isAgreed);
  const isRequiredAgreed = terms
    .filter((term) => term.isRequired)
    .every((term) => term.isAgreed);

  const canSignup = isRequiredAgreed;

  const handleClickTerm = (id: string) => {
    setTerms((prev) => {
      return prev.map((term) => {
        return term.id === id ? { ...term, isAgreed: !term.isAgreed } : term;
      });
    });
  };

  const handleAllAgreedChange = () => {
    setTerms((prev) => prev.map((term) => ({ ...term, isAgreed: !isAllAgreed })));
  };

  // 펼침 토글: 이미 열려있는 항목을 누르면 닫고, 다른 항목을 누르면 그 항목만 열림
  const handleToggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleSubmit = async () => {
    if (!isRequiredAgreed) {
      snackbar.destructive({
        title: '필수 동의 항목에 체크해주세요.',
      });
      return;
    }

    setIsPending(true);

    const agreements = Object.fromEntries(
      terms.map((term) => [term.apiKey, term.isAgreed])
    );

    try {
      const signupResponse = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agreements,
        }),
      });

      const result = await signupResponse.json();

      // HTTP 요청이 실패했는지 확인
      if (!signupResponse.ok) {
        // C001: 입력값 오류 → 동적 메시지 포함
        if (result.code === API_ERROR_CODES.COMMON.BAD_REQUEST) {
          snackbar.destructive({
            title: API_MESSAGES.COMMON.INVALID_INPUT,
            description: result.message,
          });
          return;
        }

        // S001: 서버 오류 → 동적 메시지 포함
        if (result.code === API_ERROR_CODES.SYSTEM.INTERNAL_SERVER_ERROR) {
          snackbar.destructive({
            title: '회원가입에 실패했습니다.',
            description: result.message ?? '잠시 후 다시 시도해주세요.',
          });
          return;
        }

        const errorEntry = SIGNUP_ERROR_SNACKBAR[result.code];
        if (errorEntry) {
          snackbar.destructive(errorEntry);
          return;
        }
      }
      // 응답은 성공했으나 실제 데이터가 비어있는지 확인
      if (!result.data) {
        snackbar.destructive({
          title: '회원가입을 진행할 수 없습니다.',
          description: result.message ?? '잠시 후 다시 시도해주세요.',
        });
        return;
      }
      // 가입 성공 및 간편결제 초기화
      setAccessToken(result.data.accessToken);
      setPaymentRegistered(false);
      snackbar.success({
        title: '회원가입이 완료되었습니다.',
        description: '잠시 후 메인 화면으로 이동합니다.',
      });
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error) {
      snackbar.destructive({
        title: '회원가입 중 문제가 발생했습니다.',
        description: '잠시 후 다시 시도해주세요.',
      });
      console.error(error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div>
      <AllAgreeCheckbox
        checked={isAllAgreed}
        onCheckedChange={handleAllAgreedChange}
      />
      <Separator className="my-4" />

      <section className="flex flex-col gap-2.5 mb-10">
        {terms.map((term) => (
          <AgreementCheckbox
            key={term.id}
            checked={term.isAgreed}
            onCheckedChange={() => handleClickTerm(term.id)}
            label={term.label}
            isRequired={term.isRequired}
            detailContent={TERMS_DETAIL_MAP[term.id]}
            isExpanded={expandedId === term.id}
            onToggleExpand={() => handleToggleExpand(term.id)}
          />
        ))}
      </section>

      <SignupButton
        disabled={!canSignup || isPending}
        onClick={handleSubmit}
        isPending={isPending}
      />
    </div>
  );
}
