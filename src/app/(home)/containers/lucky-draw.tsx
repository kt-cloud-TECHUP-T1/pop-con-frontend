'use client';

import { useState } from 'react';
import { CardThumbnail } from '@/components/content/card-thumbnail';
import { GridCarousel } from '@/components/content/grid-carousel';
import { Section } from '../components/section';
import { useRouter } from 'next/navigation';
import { LuckyDrawSkeleton } from '../components/skeletons';
import { Typography } from '@/components/ui/typography';
import { formatOpenAt } from '@/lib/utils';
import { BasePopupCard } from '../types';
import { usePopupLike } from '@/features/popups/hooks/use-popup-like';
import { useSectionFetch } from '../hooks/use-section-fetch';
import { NoContent } from '@/components/common/no-content';

type DrawTab = 'UPCOMING' | 'OPEN';

interface LuckyDrawCard extends BasePopupCard {
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

export const LuckyDraw = () => {
  const [activeTab, setActiveTab] = useState<DrawTab>('OPEN');
  const { data: openCards, isError: isOpenError } =
    useSectionFetch<LuckyDrawCard>(
      '/api/popups?phaseType=DRAW&phaseStatus=OPEN&limit=10'
    );
  const { data: upcomingCards, isError: isUpcomingError } =
    useSectionFetch<LuckyDrawCard>(
      '/api/popups?phaseType=DRAW&phaseStatus=UPCOMING&sort=SOONEST_OPEN&limit=10'
    );
  const { getLikedPopupState, handleClickLike } = usePopupLike<LuckyDrawCard>();
  const router = useRouter();

  if (isOpenError || isUpcomingError) return null;
  if (openCards === null || upcomingCards === null)
    return <LuckyDrawSkeleton />;

  const activeDrawCards = activeTab === 'OPEN' ? openCards : upcomingCards;
  const activeTabLabel =
    activeTab === 'OPEN'
      ? '진행 중인 드로우가 없어요.'
      : '오픈 예정 드로우가 없어요.';

  if (activeDrawCards.length === 0) {
    return <NoContent message={activeTabLabel} />;
  }

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

      <GridCarousel
        gridSize={{ default: 2, md: 3, lg: 4 }}
        carouselOpts={{ align: 'start', loop: true }}
        alignArrowToRatio="3/4"
        items={activeDrawCards.map((activeDrawCard) => {
          const likedState = getLikedPopupState(activeDrawCard);
          const { datePart, timePart } =
            activeDrawCard.overlay?.type === 'DRAW_OPEN_AT'
              ? formatOpenAt(activeDrawCard.phase.openAt)
              : { datePart: null, timePart: null };

          return (
            <CardThumbnail
              key={`lucky-draw-${activeDrawCard.popupId}`}
              thumbnailUrl={activeDrawCard.thumbnailUrl ?? undefined}
              thumbnailRatio="3/4"
              title={activeDrawCard.title}
              description={activeDrawCard.subText ?? undefined}
              caption={activeDrawCard.caption ?? undefined}
              countView={activeDrawCard.stats?.viewCount || 0}
              countLike={likedState.likeCount}
              showButtonLike
              showCountView
              showCountLike
              onClick={() => handleClick(activeDrawCard.popupId)}
              onClickLike={() => handleClickLike(activeDrawCard)}
              isLiked={likedState.isLiked}
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
    </Section>
  );
};
