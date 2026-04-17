'use client';

import { useRouter } from 'next/navigation';
import { CardThumbnail } from '@/components/content/card-thumbnail';
import { GridCarousel } from '@/components/content/grid-carousel';
import { Section } from '../components/section';
import { RankingSkeleton } from '../components/skeletons';
import { BasePopupCard, PopupPhase } from '../types';
import { useSectionFetch } from '../hooks/use-section-fetch';
import { usePopupLike } from '../hooks/use-popup-like';

interface RankingCard extends BasePopupCard {
  overlay: {
    type: 'RANK';
    rank: number;
  };
  phase: PopupPhase;
}

export const Ranking = () => {
  const rankingCards = useSectionFetch<RankingCard>('/api/popups/rankings');
  const { getLikedPopupState, handleClickLike } = usePopupLike<RankingCard>();
  const router = useRouter();

  const handleClick = (popupId: number, phaseType: 'AUCTION' | 'DRAW') => {
    if (phaseType === 'AUCTION') {
      router.push(`/auction/${popupId}`);
    } else {
      router.push(`/draw/${popupId}`);
    }
  };

  if (rankingCards === null) return <RankingSkeleton />;

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
                countView={rankingCard.stats.viewCount}
                countLike={likedState.likeCount}
                showButtonLike
                showCountView
                showCountLike
                // TODO 좋아요 작업 필요. 현재는 초기 표시 상태만 넘김
                isLiked={likedState.isLiked}
                onClickLike={() => handleClickLike(rankingCard)}
                onClick={() =>
                  handleClick(rankingCard.popupId, rankingCard.phase.type)
                }
              />
            );
          })}
        />
      )}
    </Section>
  );
};
