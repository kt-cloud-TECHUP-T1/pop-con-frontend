'use client';

import { useEffect, useState } from 'react';
import { CardThumbnail } from '@/components/content/card-thumbnail';
import { GridCarousel } from '@/components/content/grid-carousel';
import { Section } from '../components/section';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import { ApiResponse } from '@/types/api/common';
import { LuckyDrawSkeleton } from '../components/skeletons';
import { Typography } from '@/components/ui/typography';
import { formatOpenAt } from '@/lib/utils';
import { BaseCardResponse, BasePopupCard } from '../types';

type DrawTab = 'UPCOMING' | 'OPEN';

interface LuckyDrawCard extends BasePopupCard {
  supportingText: null;
  overlay: {
    type: 'DRAW_OPEN_AT';
    rank: null;
  } | null;
  phase: {
    type: 'DRAW';
    status: 'UPCOMING' | 'OPEN' | 'CLOSED';
    openAt: string;
    closeAt: string;
  };
}

type LuckyDrawCardResponse = BaseCardResponse<
  LuckyDrawCard,
  'DRAWS_OPEN' | 'DRAWS_UPCOMING'
>;

export const LuckyDraw = () => {
  const [activeTab, setActiveTab] = useState<DrawTab>('OPEN');
  const [openCards, setOpenCards] = useState<LuckyDrawCard[] | null>(null);
  const [upcomingCards, setUpcomingCards] = useState<LuckyDrawCard[] | null>(
    null
  );
  const accessToken = useAuthStore((state) => state.accessToken);
  const router = useRouter();

  useEffect(() => {
    const controller = new AbortController();

    const fetchDraws = async () => {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      };

      try {
        const [openResponse, upcomingResponse] = await Promise.all([
          fetch('/api/popups?phaseType=DRAW&phaseStatus=OPEN&limit=10', {
            signal: controller.signal,
            headers,
          }),
          fetch(
            '/api/popups?phaseType=DRAW&phaseStatus=UPCOMING&sort=SOONEST_OPEN&limit=10',
            { signal: controller.signal, headers }
          ),
        ]);

        if (openResponse.ok) {
          const result =
            (await openResponse.json()) as ApiResponse<LuckyDrawCardResponse>;
          setOpenCards(result.data?.items ?? []);
        } else {
          setOpenCards([]);
        }

        if (upcomingResponse.ok) {
          const result =
            (await upcomingResponse.json()) as ApiResponse<LuckyDrawCardResponse>;
          setUpcomingCards(result.data?.items ?? []);
        } else {
          setUpcomingCards([]);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError')
          return;
        console.error('[lucky-draw] 드로우 조회 실패', error);
        setOpenCards([]);
        setUpcomingCards([]);
      }
    };

    fetchDraws();

    return () => controller.abort();
  }, [accessToken]);

  if (openCards === null || upcomingCards === null)
    return <LuckyDrawSkeleton />;

  const activeDrawCards = activeTab === 'OPEN' ? openCards : upcomingCards;

  const handleClick = (popupId: number) => {
    router.push(`/draw/${popupId}`);
  };

  return (
    <Section
      id="lucky-draw"
      title="드로우"
      showButtonMore
      // TODO 더보기 작업 필요
      // onClickMore={handleClickMore}
    >
      <div className="flex gap-2 mb-6">
        {(
          [
            { tab: 'UPCOMING', label: '오픈 예정' },
            { tab: 'OPEN', label: '드로우 진행중' },
          ] as { tab: DrawTab; label: string }[]
        ).map(({ tab, label }) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-black text-white'
                : 'bg-[var(--neutral-95)] text-[var(--neutral-40)]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {activeDrawCards.length === 0 ? (
        <div className="min-h-[250px] flex items-center justify-center">
          {activeTab === 'OPEN'
            ? '진행 중인 드로우가 없어요.'
            : '오픈 예정 드로우가 없어요.'}
        </div>
      ) : (
        <GridCarousel
          gridSize={{ default: 2, md: 3, lg: 4 }}
          carouselOpts={{ align: 'start' }}
          alignArrowToRatio="3/4"
          items={activeDrawCards.map((activeDrawCard) => {
            const { datePart, timePart } =
              activeDrawCard.overlay?.type === 'DRAW_OPEN_AT'
                ? formatOpenAt(activeDrawCard.phase.openAt)
                : { datePart: null, timePart: null };

            return (
              <CardThumbnail
                key={activeDrawCard.popupId}
                thumbnailUrl={activeDrawCard.thumbnailUrl ?? undefined}
                thumbnailRatio="3/4"
                title={activeDrawCard.title}
                description={activeDrawCard.subText ?? undefined}
                caption={activeDrawCard.caption ?? undefined}
                countView={activeDrawCard.stats.viewCount}
                countLike={activeDrawCard.stats.likeCount}
                showButtonLike
                showCountView
                showCountLike
                onClick={() => handleClick(activeDrawCard.popupId)}
                // TODO 좋아요 작업 필요. 현재는 초기 표시 상태만 넘김
                isLiked={activeDrawCard.liked ?? false}
                overlayBadge={
                  datePart && timePart ? (
                    <Typography
                      variant="label-2"
                      weight="medium"
                      className="text-white"
                    >
                      {datePart} {timePart} 오픈
                    </Typography>
                  ) : undefined
                }
                overlayBadgeBackground="var(--orange-50)"
              />
            );
          })}
        />
      )}
    </Section>
  );
};
