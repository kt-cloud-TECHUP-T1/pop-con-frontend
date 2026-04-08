'use client';

import Lottie from 'react-lottie-player';
import Hourglass from '../../../../public/lottie/Hourglass.json';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Wrapper } from '@/components/layout/wrapper';
import { Typography } from '@/components/ui/typography';
import { leaveQueue, leaveQueueBeacon } from '@/lib/api/leave-queue';
import { QUEUE_ERROR_MESSAGES } from '@/constants/queue';
import { useRef } from 'react';
import { useQueue } from '../hooks/use-queue';
import { queueTokenStorage } from '../utils/queue-token';
import { useQueueStore } from '../stores/queue-store';
import { useEffect, useState } from 'react';
import { QueueEntryResponse } from '../types/queue';
import { useAuthStore } from '@/features/auth/stores/auth-store';

export const QueuePageClient = () => {
  const [token, setToken] = useState(queueTokenStorage.get() ?? '');
  const router = useRouter();
  const isManualLeave = useRef(false); // 대기열 이탈 api 중복호출 방지

  useEffect(() => {
    const handlePopState = () => {
      // 버튼 클릭으로 인한 popstate면 스킵
      if (isManualLeave.current) {
        isManualLeave.current = false;
        return;
      }

      const queueToken = sessionStorage.getItem('queueToken');
      if (!queueToken) return;

      leaveQueueBeacon(queueToken);
      sessionStorage.removeItem('queueToken');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleBack = async () => {
    const queueToken = sessionStorage.getItem('queueToken') ?? '';
    const result = await leaveQueue(queueToken);

    switch (result.code) {
      case 'SUCCESS':
      case 'Q002':
      case 'Q003': {
        sessionStorage.removeItem('queueToken');
        isManualLeave.current = true;
        router.back();
        return;
      }
      case 'S001': {
        console.log(QUEUE_ERROR_MESSAGES[result.code]);
        return;
      }
    }
  };

  /////////////////////////////////////////////////////////
  const drawId = useQueueStore((state) => state.drawId);
  const setDrawId = useQueueStore((state) => state.setDrawId);
  const clearDrawId = useQueueStore((state) => state.clearDrawId);
  const accessToken = useAuthStore((state) => state.accessToken);

  const clearQueueState = () => {
    queueTokenStorage.remove();
    sessionStorage.removeItem('queue_draw_id');
    setToken('');
    clearDrawId();
  };

  // 드로우 대기열 진입 -> 새로고침 복구
  useEffect(() => {
    // drawId null(zustand 휘발) + token 있음 = 새로고침으로 판별
    if (!drawId && token) {
      const savedDrawId = sessionStorage.getItem('queue_draw_id');
      if (!savedDrawId) {
        router.replace('/');
        return;
      }

      const rejoinQueue = async () => {
        try {
          const response = await fetch(`/api/queue/draws/${savedDrawId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (!response.ok) {
            queueTokenStorage.remove();
            sessionStorage.removeItem('queue_draw_id');
            router.replace('/');
            return;
          }

          const result = (await response.json()) as QueueEntryResponse;

          if (result.data && 'queueToken' in result.data) {
            queueTokenStorage.save(result.data.queueToken);
            setDrawId(savedDrawId);
            setToken(result.data.queueToken);
          } else {
            // BLOCKED 등 queueToken이 없는 케이스
            clearQueueState();
            router.replace('/');
          }
        } catch {
          clearQueueState();
          router.replace('/');
        }
      };

      void rejoinQueue();
    }
  }, [drawId, router, setDrawId]);
  // END 드로우 대기열 진입 -> 새로고침 복구

  const { position, estimatedWaitSeconds, progress } = useQueue({
    queueToken: token,
    onActive: () => router.push('/security-quiz'),
  });

  return (
    <Wrapper>
      <section className="mx-auto w-full max-w-[720px] h-screen flex items-center flex-col justify-center px-6 py-10 text-center">
        <Lottie
          loop
          animationData={Hourglass}
          play
          style={{ width: 200, height: 250 }}
        />

        {/* 순번 */}
        <Typography variant="title-1" weight="bold" className="mt-8">
          나의 순서
        </Typography>
        <Typography
          variant="display-2"
          weight="bold"
          className="tracking-[-0.03em] text-[var(--neutral-30)] mb-2"
        >
          {position ?? '-'}번째
        </Typography>
        {estimatedWaitSeconds !== null && (
          <Typography variant="body-2" className="text-[var(--neutral-60)]">
            예상 대기 시간 {Math.floor(estimatedWaitSeconds / 60)}분{' '}
            {estimatedWaitSeconds % 60}초
          </Typography>
        )}

        <Progress
          value={progress}
          minVisualPercent={8}
          className="mx-auto mt-10 max-w-[480px]"
        />

        <Typography
          variant="body-2"
          className="mt-10 whitespace-pre-line leading-7 text-[var(--neutral-60)]"
        >
          잠시만 기다리시면 대기번호에 따라 자동으로 접속됩니다.
          <br />
          새로고침하면 대기시간이 길어질 수 있습니다.
        </Typography>

        <div className="mt-10">
          <Button
            variant="tertiary"
            size="large"
            className="border border-[var(--line-4)]"
            onClick={handleBack}
          >
            <Typography variant="label-1">이전으로 돌아가기</Typography>
          </Button>
        </div>
      </section>
    </Wrapper>
  );
};
