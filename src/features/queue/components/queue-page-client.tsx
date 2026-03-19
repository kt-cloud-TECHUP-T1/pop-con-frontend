'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Wrapper } from '@/components/layout/wrapper';
import { Typography } from '@/components/ui/typography';
import { formatRankText } from '@/features/queue/utils/format-rank-text';

export const QueuePageClient = () => {
  const router = useRouter();
  const rankText = formatRankText(12843);

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

        {/* 진행률 바 UI는 유지, 현재는 최소 시각값만 표시 */}
        <Progress
          value={8}
          minVisualPercent={8}
          className="mx-auto mt-10 max-w-[480px]"
        />

        {/* 대기 안내 문구 */}
        <Typography
          variant="body-2"
          className="mt-10 whitespace-pre-line leading-7 text-[var(--neutral-60)]"
        >
          접속 인원이 많아 참여 전 대기열에서 순서를 확인하고 있습니다.
          <br />
          순서가 되면 다음 단계로 이동합니다.
        </Typography>

        <div className="mt-10">
          {/* 임시 액션: 이전 페이지로 복귀 */}
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
