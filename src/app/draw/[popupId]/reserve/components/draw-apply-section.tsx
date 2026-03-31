'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Typography } from '@/components/ui/typography';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
// TODO 테스트 후 주석 제거
// import { useAuthStore } from '@/features/auth/stores/auth-store';
import { queueTokenStorage } from '@/features/queue/utils/queue-token';
import { useQueueStore } from '@/features/queue/stores/queue-store';
import { QueueEntryResponse } from '@/features/queue/types/queue';

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
  // TODO 테스트 후 주석 제거
  // const accessToken = useAuthStore((state) => state.accessToken);
  const router = useRouter();
  const setDrawId = useQueueStore((state) => state.setDrawId);

  const handleCheck = (index: number, checked: boolean) => {
    setChecks((prev) => {
      const next = [...prev];
      next[index] = checked;
      return next;
    });
  };

  const handleSubmit = async () => {
    // TODO 테스트 후 주석 제거
    if (selectedOptionId === null) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch(`/api/queue/draws/${drawId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // TODO 테스트 후 주석 제거
          // Authorization: `Bearer ${accessToken}`,
        },
      });

      const result = (await response.json()) as QueueEntryResponse;

      if (!response.ok || !result.data) {
        setErrorMessage(result.message ?? DEFAULT_SUBMIT_ERROR);
        return;
      }

      const { status } = result.data;

      if (status !== 'BLOCKED' && 'queueToken' in result.data) {
        queueTokenStorage.save(result.data.queueToken);
      }

      const statusHandler: Record<string, () => void> = {
        ACTIVE: () => router.push('/security-quiz'),
        WAITING: () => {
          sessionStorage.setItem('queue_draw_id', drawId);
          setDrawId(drawId);
          router.push('/queue');
        },
        BLOCKED: () => {
          const msg =
            result.data?.status === 'BLOCKED' ? result.data.blockedUntil : null;
          setErrorMessage(
            msg ? `${msg}까지 접근이 제한되었습니다.` : result.message
          );
        },
      };
      const handler = statusHandler[status];
      if (handler) {
        handler();
      } else {
        setErrorMessage(DEFAULT_SUBMIT_ERROR);
      }
    } catch (error) {
      console.error('[draw-apply-section]', error);
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
        // TODO 테스트를 위하여 임시 주석
        disabled={!isAllChecked || selectedOptionId === null || isSubmitting}
        onClick={handleSubmit}
      >
        {isSubmitting ? '신청 중...' : '드로우 신청하기'}
      </Button>
    </div>
  );
}
