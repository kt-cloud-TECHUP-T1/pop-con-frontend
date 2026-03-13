'use client';

import { Separator } from '@/components/ui/separator';
import { snackbar } from '@/components/ui/snackbar';
import { TERMS } from '@/constants/auth';
import {
  getRegisterToken,
  setAccessToken,
  setRegisterToken,
} from '@/features/auth/utils/auth-storage';
import { signupWithAgreements } from '@/features/auth/signup/services/signup';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import AllAgreeCheckbox from '../components/all-agree-checkbox';
import AgreementCheckbox from '../components/agreement-checkbox';
import SignupButton from '../components/signup-button';

const initialTerms = TERMS.map((term) => ({ ...term, isAgreed: false }));

export default function TermsAgreements() {
  const router = useRouter();
  const [terms, setTerms] = useState(initialTerms);
  const [isPending, setIsPending] = useState(false);

  const isAllAgreed = terms.every((term) => term.isAgreed);
  const canSignup = terms
    .filter((term) => term.isRequired)
    .every((term) => term.isAgreed);

  const handleClickTerm = (index: number) => {
    setTerms((prev) =>
      prev.map((term, i) =>
        i === index ? { ...term, isAgreed: !term.isAgreed } : term
      )
    );
  };

  const handleAllAgreedChange = () => {
    setTerms((prev) => {
      const allAgreed = prev.every((term) => term.isAgreed);
      return prev.map((term) => ({ ...term, isAgreed: !allAgreed }));
    });
  };

  const getTermAgreement = (id: string) =>
    terms.find((term) => term.id === id)?.isAgreed ?? false;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isPending || !canSignup) return;

    const registerToken = getRegisterToken();

    if (!registerToken) {
      snackbar.destructive({
        title: '세션 만료',
        duration: 1600,
        description:
          '회원가입 세션이 만료되었습니다. 다시 가입 절차를 진행해주세요.',
      });
      router.replace('/login');
      return;
    }

    setIsPending(true);
    try {
      const result = await signupWithAgreements({
        registerToken,
        agreements: {
          isPrivacyPolicyAgreed: getTermAgreement('privacy'),
          isIdentifierPolicyAgreed: getTermAgreement('identifierPolicy'),
          isServicePolicyAgreed: getTermAgreement('servicePolicy'),
          isMarketingAgreed: getTermAgreement('marketing'),
        },
      });

      if (result.status === 'success') {
        setAccessToken(result.data.accessToken);
        setRegisterToken();
        snackbar.informative({
          title: '회원가입 완료',
          description: `${result.data.name}님 반갑습니다.`,
        });
        router.replace('/');
        return;
      }

      if (result.status === 'invalidInput') {
        const details = result.data ? Object.values(result.data)[0] : '';
        snackbar.destructive({
          title: '입력값 오류',
          description: details || result.message,
        });
        return;
      }

      if (result.status === 'alreadyJoined') {
        setRegisterToken();
        snackbar.informative({
          title: '가입 완료 상태',
          description: result.message,
        });
        router.replace('/login');
        return;
      }

      if (result.status === 'sessionExpired') {
        setRegisterToken();
        snackbar.destructive({
          title: '세션 만료',
          description: result.message,
        });
        router.replace('/login');
        return;
      }

      if (result.status === 'invalidAuth') {
        snackbar.destructive({
          title: '인증 정보 오류',
          description: result.message,
        });
        return;
      }

      if (result.status === 'missingSocialInfo') {
        snackbar.destructive({
          title: '가입 정보 오류',
          description: result.message,
        });
        return;
      }

      snackbar.destructive({
        title: '회원가입 실패',
        description: result.message,
      });
    } catch {
      snackbar.destructive({
        title: '회원가입 실패',
        description: '처리 중 오류가 발생했습니다. 다시 시도해주세요.',
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <AllAgreeCheckbox
        checked={isAllAgreed}
        onCheckedChange={handleAllAgreedChange}
      />
      <Separator className="my-4" />

      <section className="flex flex-col gap-2.5 mb-10">
        {terms.map((term, index) => (
          <AgreementCheckbox
            key={term.id}
            checked={term.isAgreed}
            onCheckedChange={() => handleClickTerm(index)}
            label={term.label}
            isRequired={term.isRequired}
          />
        ))}
      </section>

      <SignupButton disabled={!canSignup} isPending={isPending} />
    </form>
  );
}
