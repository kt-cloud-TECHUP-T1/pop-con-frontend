'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Typography } from '@/components/ui/typography';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import { snackbar } from '@/components/ui/snackbar';
import { DRAW_ENTRY_ERROR_MESSAGE } from '@/constants/draw-apply';
import { postDrawEntry } from '@/lib/api/draw-apply';

const DEFAULT_SUBMIT_ERROR =
  '드로우 신청에 실패했습니다. 잠시 후 다시 시도해주세요.';

interface DrawApplySectionProps {
  drawId: string;
  selectedOptionId: number | null;
}

export default function DrawApplySection({
  drawId,
  selectedOptionId,
}: DrawApplySectionProps) {
  const [checks, setChecks] = useState([false, false]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);

  const handleCheck = (index: number, checked: boolean) => {
    setChecks((prev) => {
      const next = [...prev];
      next[index] = checked;
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!accessToken) {
      snackbar.destructive({
        title: '로그인이 필요합니다.',
      });
      return;
    }

    if (selectedOptionId === null) {
      setErrorMessage('응모할 회차를 선택해주세요.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await postDrawEntry(
        Number(drawId),
        selectedOptionId,
        {
          isPrivacyAgreed: checks[1],
          isTermsAgreed: checks[0],
        },
        accessToken
      );

      if (result.code === 'SUCCESS') {
        snackbar.success({
          title: '응모 완료',
          description: result.message,
        });
        router.push(`/draw/${drawId}/success`);
        return;
      }

      if (result.code === 'C001') {
        const validationMessage =
          result.data.isTermsAgreed ??
          result.data.isPrivacyAgreed ??
          result.message;

        setErrorMessage(validationMessage);
        return;
      }

      const mappedMessage =
        DRAW_ENTRY_ERROR_MESSAGE[result.code] ?? DEFAULT_SUBMIT_ERROR;

      setErrorMessage(mappedMessage);

      if (result.code === 'A002') {
        snackbar.destructive({
          title: '인증 오류',
          description: mappedMessage,
        });
      }
    } catch (error) {
      console.error('[DrawApplySection/handleSubmit]', error);
      setErrorMessage(DEFAULT_SUBMIT_ERROR);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAllChecked = checks.every(Boolean);

  return (
    <div className="pt-ms flex flex-col gap-ms">
      <div className="assign flex flex-col gap-s">
        <Typography variant="body-1" weight="bold">
          이용 약관 동의
        </Typography>

        <div className="flex flex-col gap-2xs">
          <div className="flex gap-xs">
            <Checkbox
              checked={checks[0]}
              onCheckedChange={(checked) => handleCheck(0, checked === true)}
            />
            <Typography variant="body-2" weight="regular">
              (필수){' '}
              <Link className="underline" href={`/draw/${drawId}`}>
                드로우 이용약관
              </Link>
              을 동의합니다.
            </Typography>
          </div>
          <div className="flex gap-xs">
            <Checkbox
              checked={checks[1]}
              onCheckedChange={(checked) => handleCheck(1, checked === true)}
            />
            <Typography variant="body-2" weight="regular">
              (필수){' '}
              <Link className="underline" href={`/draw/${drawId}`}>
                개인정보 제 3자 제공
              </Link>
              을 동의합니다.
            </Typography>
          </div>
        </div>
      </div>

      {errorMessage && (
        <Typography variant="body-2" className="text-[var(--status-negative)]">
          {errorMessage}
        </Typography>
      )}

      <Button
        disabled={!isAllChecked || selectedOptionId === null || isSubmitting}
        onClick={handleSubmit}
      >
        {isSubmitting ? '신청 중...' : '드로우 신청하기'}
      </Button>
    </div>
  );
}
