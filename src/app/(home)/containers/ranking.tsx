'use client';

import { useRouter } from 'next/navigation';
import { CardThumbnail } from '@/components/content/card-thumbnail';
import { GridCarousel } from '@/components/content/grid-carousel';
import { Section } from '../components/section';
import { RankingSkeleton } from '../components/skeletons';
import { BasePopupCard } from '../types';
import { useSectionFetch } from '../hooks/use-section-fetch';
import { usePopupLike } from '@/features/popups/hooks/use-popup-like';
import { FetchError } from '@/components/common/fetch-error';
import { NoContent } from '@/components/common/no-content';
import { getPopupHref } from '@/lib/utils';

interface RankingCard extends BasePopupCard {
  overlay: {
    type: 'RANK';
    rank: number;
  };
}

export const Ranking = () => {
  const { data: rankingCards, isError } = useSectionFetch<RankingCard>(
    '/api/popups/rankings'
  );
  const { getLikedPopupState, handleClickLike } = usePopupLike<RankingCard>();
  const router = useRouter();

  if (isError) return <FetchError sectionTitle="랭킹" />;
  if (rankingCards === null) return <RankingSkeleton />;
  if (rankingCards.length === 0)
    return <NoContent message="순위에 오른 팝업이 없어요." />;

  return (
    <Section
      title="팝콘 랭킹"
      showButtonMore
      // TODO 더보기 작업 필요
      // onClickMore={handleClickMore}
    >
      <GridCarousel
        gridSize={{
          default: 2,
          md: 3,
          lg: 5,
        }}
        carouselOpts={{ align: 'start', loop: true }}
        alignArrowToRatio="3/4"
        items={rankingCards.map((rankingCard) => {
          const likedState = getLikedPopupState(rankingCard);

          return (
            <CardThumbnail
              key={`ranking-${rankingCard.popupId}`}
              index={rankingCard.overlay.rank}
              thumbnailUrl={rankingCard.thumbnailUrl ?? undefined}
              thumbnailRatio="3/4"
              title={rankingCard.title}
              description={rankingCard.subText ?? undefined}
              caption={rankingCard.caption ?? undefined}
              countView={rankingCard.stats?.viewCount || 0}
              countLike={likedState.likeCount}
              showButtonLike
              showCountView
              showCountLike
              isLiked={likedState.isLiked}
              onClickLike={() => handleClickLike(rankingCard)}
              onClick={() =>
                router.push(
                  getPopupHref(rankingCard.popupId, rankingCard.phase.type)
                )
              }
            />
          );
        })}
      />
    </Section>
  );
};
