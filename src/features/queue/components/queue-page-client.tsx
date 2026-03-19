'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Wrapper } from '@/components/layout/wrapper';
import { Typography } from '@/components/ui/typography';
import { useQueueStatus } from '@/features/queue/hooks/use-queue-status';
import { formatRankText } from '@/features/queue/utils/format-rank-text';

const DEFAULT_PROGRESS = 8;
const DEFAULT_WAITING_MESSAGE =
  '접속 인원이 많아 참여 전 대기열에서 순서를 확인하고 있습니다.';
const READY_MESSAGE = '입장 순서가 되어 다음 단계로 이동하고 있습니다.';
const EXPIRED_MESSAGE = '대기 가능 시간이 만료되었습니다. 다시 시도해주세요.';
const CANCELLED_MESSAGE =
  '대기열이 종료되었습니다. 이전 화면으로 돌아가주세요.';
const MISSING_QUEUE_ID_MESSAGE =
  '대기열 식별값이 없어 상태를 확인할 수 없습니다.';

export const QueuePageClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  // TODO 백엔드 명세 나오면 맞춰 수정할 필요 있음
  const queueId = searchParams.get('queueId') ?? searchParams.get('entryToken');
  const initialPosition = searchParams.get('initialPosition');
  const fallbackRank = initialPosition ? Number(initialPosition) : null;
  const nextPath = searchParams.get('next');
  const { data, error, isLoading, isFetching } = useQueueStatus(queueId);
  const redirectTarget = data?.nextUrl ?? nextPath;

  useEffect(() => {
    if (data?.status !== 'READY') {
      return;
    }

    if (!redirectTarget) {
      return;
    }

    const redirectTimer = window.setTimeout(() => {
      router.replace(redirectTarget);
    }, 800);

    return () => {
      window.clearTimeout(redirectTimer);
    };
  }, [data?.status, redirectTarget, router]);

  const rank = data?.rank ?? (Number.isNaN(fallbackRank) ? null : fallbackRank);
  const rankText = formatRankText(rank);
  const progressValue = data?.progressPercent ?? DEFAULT_PROGRESS;
  const statusMessage = (() => {
    if (!queueId) {
      return MISSING_QUEUE_ID_MESSAGE;
    }

    if (data?.status === 'READY') {
      return data.message ?? READY_MESSAGE;
    }

    if (data?.status === 'EXPIRED') {
      return data.message ?? EXPIRED_MESSAGE;
    }

    if (data?.status === 'CANCELLED') {
      return data.message ?? CANCELLED_MESSAGE;
    }

    if (error instanceof Error) {
      return error.message;
    }

    if (data?.message) {
      return data.message;
    }

    if (isLoading) {
      return '대기열 정보를 불러오고 있습니다.';
    }

    return DEFAULT_WAITING_MESSAGE;
  })();

  const statusCaption = (() => {
    if (!queueId) {
      return 'queueId 또는 entryToken이 필요합니다.';
    }

    if (data?.status === 'READY') {
      return '입장 준비 완료';
    }

    if (data?.status === 'EXPIRED') {
      return '대기 만료';
    }

    if (data?.status === 'CANCELLED') {
      return '대기 종료';
    }

    if (isFetching) {
      return '순서를 다시 확인하고 있습니다.';
    }

    return '순서가 되면 다음 단계로 이동합니다.';
  })();

  return (
    <Wrapper>
      <section className="mx-auto w-full max-w-[720px] h-screen flex items-center flex-col justify-center px-6 py-10 text-center">
        {/* 상단 일러스트 영역(현재는 더미 박스) */}
        <div className="h-[248px] w-[200px] mx-auto bg-[var(--neutral-95)] p-4 sm:p-5"></div>
        {/* 순번 */}
        <Typography variant="title-1" weight="bold" className="mt-8">
          나의 순서
        </Typography>
        <Typography
          variant="display-2"
          weight="bold"
          className="tracking-[-0.03em] text-[var(--neutral-30)] mb-2"
        >
          {rankText}번째
        </Typography>

        <Progress
          value={progressValue}
          minVisualPercent={DEFAULT_PROGRESS}
          className="mx-auto mt-10 max-w-[480px]"
        />

        <Typography
          variant="body-2"
          className="mt-10 whitespace-pre-line leading-7 text-[var(--neutral-60)]"
        >
          {statusMessage}
          {/* 0도 유효한 값일 수 있어서 조건 체크 */}
          {data?.aheadCount !== null && data?.aheadCount !== undefined ? (
            <>
              <br />
              현재 앞에 {formatRankText(data.aheadCount)}명이 대기 중입니다.
            </>
          ) : null}
          <br />
          {statusCaption}
        </Typography>

        <div className="mt-10">
          <Button
            variant="tertiary"
            size="large"
            className="border border-[var(--line-4)]"
            onClick={() => router.back()}
          >
            <Typography variant="label-1">이전으로 돌아가기</Typography>
          </Button>
        </div>
      </section>
    </Wrapper>
  );
};
