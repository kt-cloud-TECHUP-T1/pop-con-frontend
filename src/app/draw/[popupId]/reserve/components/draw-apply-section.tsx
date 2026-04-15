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
import { DrawEntrySuccessData } from '@/types/draw/draw-apply';
import DrawEntrySuccessModal from '@/components/sale-detail/info/draw-entry-success-modal';
import DrawEntryDuplicateModal from '@/components/sale-detail/info/draw-entry-duplicate-modal';
import { quizPassedTokenStorage } from '@/lib/utils';
import { Box } from '@/components/ui/box';
import { useUserMeQuery } from '@/features/user/queries/use-user-me-query';
import { useRouter } from 'next/navigation';

const DEFAULT_SUBMIT_ERROR =
  '드로우 신청에 실패했습니다. 잠시 후 다시 시도해주세요.';

interface DrawApplySectionProps {
  drawId: string;
  selectedOptionId: number | null;
  selectedDate: string | null;
  selectedEntryTime: string | null;
}

export default function DrawApplySection({
  drawId,
  selectedOptionId,
  selectedDate,
  selectedEntryTime,
}: DrawApplySectionProps) {
  const { data: userMe } = useUserMeQuery();
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
  const router = useRouter();

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

    const quizPassedToken = quizPassedTokenStorage.get();

    if (!quizPassedToken) {
      snackbar.destructive({
        title: '보안퀴즈 필요',
        description: '보안퀴즈를 다시 진행해주세요.',
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
        accessToken,
        quizPassedToken
      );

      if (result.code === 'SUCCESS') {
        //응모 성공 후 퀴즈패스토큰 삭제
        quizPassedTokenStorage.remove();
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
  const userName = userMe?.name ?? '';
  const userPhone = userMe?.phone ?? '';
  const maskedPhone = userPhone.replace(
    /^(\d{3})-?\d{4}-?(\d{4})$/,
    '$1-****-$2'
  );
  const selectedTimeText = (() => {
    if (!selectedEntryTime) return '시간을 선택해주세요';

    const [hourText, minuteText = '00'] = selectedEntryTime.split(':');
    const hour = Number(hourText);
    const period = hour < 12 ? '오전' : '오후';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;

    return `${period} ${displayHour.toString().padStart(2, '0')}:${minuteText}`;
  })();

  return (
    <div className=" flex flex-col gap-ms">
      <div className="draw-apply-info flex flex-col ">
        <Typography variant="body-1" weight="bold">
          응모 정보 요약
        </Typography>
        <div>
          <div className="flex justify-between pt-ms">
            <Typography
              variant="label-1"
              weight="regular"
              className="text-[var(--content-extra-low)]"
            >
              선택한 날짜
            </Typography>
            <Typography
              variant="label-1"
              className="text-[var(--content-high)]"
            >
              {selectedDate ?? '날짜를 선택해주세요'}
            </Typography>
          </div>
          <div className="flex justify-between pt-[5px]">
            <Typography
              variant="label-1"
              weight="regular"
              className="text-[var(--content-extra-low)]"
            >
              선택한 시간
            </Typography>
            <Typography
              variant="label-1"
              className="text-[var(--content-high)]"
            >
              {selectedTimeText}
            </Typography>
          </div>
        </div>
      </div>

      <div className=" border-b border-[var(--line-3)]"></div>
      <div>
        <div className="flex justify-between">
          <Typography
            variant="label-1"
            weight="regular"
            className="text-[var(--content-extra-low)]"
          >
            이름
          </Typography>
          <Typography variant="label-1" className="text-[var(--content-high)]">
            {userName}
          </Typography>
        </div>
        <div className="flex justify-between pt-[5px]">
          <Typography
            variant="label-1"
            weight="regular"
            className="text-[var(--content-extra-low)]"
          >
            연락처
          </Typography>
          <Typography variant="label-1" className="text-[var(--content-high)]">
            {userPhone}
          </Typography>
        </div>
      </div>

      <Box
        radius="ML"
        border="#0A0A0A14"
        className="p-ms w-full flex flex-col gap-s"
      >
        <Typography
          variant="label-3"
          className="text-[var(--content-extra-low)]"
        >
          현재 등록된 정보({userName}/{maskedPhone})로 응모할까요? 결과도 이
          번호로 알려드려요.
        </Typography>
        <div>
          <Button
            variant="secondary"
            onClick={() => {
              router.push('/mypage/info/profile/personal');
            }}
          >
            정보 수정하기
          </Button>
        </div>
      </Box>
      <div className=" border-b border-[var(--line-3)]"></div>

      <div className="assign flex flex-col gap-s">
        <Typography variant="body-1" weight="bold">
          이용 약관 동의
        </Typography>

        <div className="flex flex-col gap-s">
          <div className="flex gap-xs">
            <Checkbox
              checked={checks[0]}
              onCheckedChange={(checked) => handleCheck(0, checked === true)}
            />
            <Typography variant="body-2" weight="regular">
              (필수) 개인정보 제3자 제공 동의: 당첨 시 본인 확인 및안내를 위해
              주최측에 정보를 제공합니다.
            </Typography>
          </div>
          <div className="flex gap-xs">
            <Checkbox
              checked={checks[1]}
              onCheckedChange={(checked) => handleCheck(1, checked === true)}
            />
            <Typography variant="body-2" weight="regular">
              (필수) 응모 정보 확인 동의: 마이페이지에 등록된 정보가 본인의
              것임을 확인하며, 허위 정보일 경우 당첨이 취소될 수 있음에
              동의합니다.
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
