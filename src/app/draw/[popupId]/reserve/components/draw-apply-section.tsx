'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Typography } from '@/components/ui/typography';
import { useState } from 'react';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import { useMyId } from '@/hooks/use-my-id';
import { useApplyPageCollector } from '@/features/anti-macro';
import { snackbar } from '@/components/ui/snackbar';
import { DRAW_ENTRY_ERROR_MESSAGE } from '@/constants/draw-apply';
import { postDrawEntry } from '@/lib/api/draw-apply';
import { DrawEntrySuccessData } from '@/types/applay/draw-apply';
import DrawEntrySuccessModal from '@/components/sale-detail/info/draw-entry-success-modal';
import DrawEntryDuplicateModal from '@/components/sale-detail/info/draw-entry-duplicate-modal';

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
  const accessToken = useAuthStore((state) => state.accessToken);
  const userId = useMyId();
  const { submitSignals } = useApplyPageCollector({
    page: 'draw-application',
    userId: userId ?? '',
  });
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isAlreadyEnteredModalOpen, setIsAlreadyEnteredModalOpen] =
    useState(false);
  const [successData, setSuccessData] = useState<DrawEntrySuccessData | null>(
    null
  );

  //예약 신청 페이지 버튼
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
      snackbar.destructive({
        title: '응모할 회차를 선택해주세요.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await submitSignals();

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
        setSuccessData(result.data);
        setIsSuccessModalOpen(true);
        return;
      }

      if (result.code === 'D005') {
        setIsAlreadyEnteredModalOpen(true);
        return;
      }

      if (result.code === 'C001') {
        const validationMessage =
          result.data.isTermsAgreed ??
          result.data.isPrivacyAgreed ??
          result.message;

        snackbar.destructive({
          title: '응모 실패',
          description: validationMessage,
        });
        return;
      }

      const mappedMessage =
        DRAW_ENTRY_ERROR_MESSAGE[result.code] ?? DEFAULT_SUBMIT_ERROR;

      snackbar.destructive({
        title: '응모 실패',
        description: mappedMessage,
      });
    } catch (error) {
      console.error('[DrawApplySection/handleSubmit]', error);

      snackbar.destructive({
        title: '응모 실패',
        description: DEFAULT_SUBMIT_ERROR,
      });
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
      <DrawEntrySuccessModal
        open={isSuccessModalOpen}
        data={successData}
        onClose={() => setIsSuccessModalOpen(false)}
      />

      <DrawEntryDuplicateModal
        open={isAlreadyEnteredModalOpen}
        onClose={() => setIsAlreadyEnteredModalOpen(false)}
      />
    </div>
  );
}
