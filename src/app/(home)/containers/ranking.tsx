'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CardThumbnail } from '@/components/content/card-thumbnail';
import { GridCarousel } from '@/components/content/grid-carousel';
import { Section } from '../components/section';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import { ApiResponse } from '@/types/api/common';

interface RankingCard {
  popupId: number;
  title: string;
  supportingText: string | null;
  subText: string | null;
  caption: string | null;
  thumbnailUrl: string | null;
  liked: boolean | null;
  stats: {
    likeCount: number;
    viewCount: number;
  };
  overlay: {
    type: 'RANK';
    rank: number;
  };
  phase: {
    type: 'AUCTION';
    status: 'UPCOMING' | 'OPEN' | 'CLOSED';
    openAt: string;
    closeAt: string;
  };
}

interface RankingCardResponse {
  sectionKey: 'RANKINGS_WEEKLY';
  itemCount: number;
  items: RankingCard[];
}

export const Ranking = () => {
  const [rankingCards, setRankingCards] = useState<RankingCard[] | null>(null);
  const accessToken = useAuthStore((state) => state.accessToken);
  const router = useRouter();

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const response = await fetch('/api/popups/rankings', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
          },
        });

        if (!response.ok) {
          setRankingCards([]);
          return;
        }

        const result =
          (await response.json()) as ApiResponse<RankingCardResponse>;
        setRankingCards(result.data?.items ?? []);
      } catch (error) {
        console.error('[ranikng] 랭킹 조회 실패', error);
      }
    };
    fetchRanking();
  }, [accessToken]);

  const handleClick = (popupId: number) => {
    router.push(`/auction/${popupId}`);
  };

  if (rankingCards === null) return null;

  return (
    <Section
      title="팝콘 랭킹"
      showButtonMore
      // TODO 더보기 작업 필요
      // onClickMore={handleClickMore}
    >
      {rankingCards.length === 0 ? (
        <div className="min-h-[250px] flex items-center justify-center">
          순위에 오른 팝업이 없어요.
        </div>
      ) : (
        <GridCarousel
          gridSize={{
            default: 2,
            md: 3,
            lg: 5,
          }}
          carouselOpts={{ align: 'start' }}
          alignArrowToRatio="3/4"
          items={rankingCards.map((rankingCard) => (
            <CardThumbnail
              key={rankingCard.popupId}
              index={rankingCard.overlay.rank}
              thumbnailUrl={rankingCard.thumbnailUrl ?? undefined}
              thumbnailRatio="3/4"
              title={rankingCard.title}
              description={rankingCard.supportingText ?? undefined}
              caption={rankingCard.caption ?? undefined}
              countView={rankingCard.stats.viewCount}
              countLike={rankingCard.stats.likeCount}
              showButtonLike
              showCountView
              showCountLike
              isLiked={rankingCard.liked ?? false}
              onClick={() => handleClick(rankingCard.popupId)}
              // TODO 좋아요 작업 필요
              // onClickLike={() => handleClickLike(rankingCard.popupId)}
            />
          ))}
        />
      )}
    </Section>
  );
};
