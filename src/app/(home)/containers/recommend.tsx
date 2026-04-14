'use client';

import { CardThumbnail } from '@/components/content/card-thumbnail';
import { GridCarousel } from '@/components/content/grid-carousel';
import { Section } from '../components/section';
import { RecommendSkeleton } from '../components/skeletons';
import { useRouter } from 'next/navigation';
import { BasePopupCard } from '../types';
import { useSectionFetch } from '../hooks/use-section-fetch';
import { usePopupLike } from '../hooks/use-popup-like';

interface RecommendedCard extends BasePopupCard {
  overlay: null;
  phase: {
    type: 'AUCTION' | 'DRAW';
    status: 'UPCOMING' | 'OPEN' | 'CLOSED';
    openAt: string;
    closeAt: string;
  };
}

export const Recommend = () => {
  const recommendedCards = useSectionFetch<RecommendedCard>(
    '/api/popups/recommended'
  );
  const { getLikedPopupState, handleClickLike } =
    usePopupLike<RecommendedCard>();
  const router = useRouter();

  const handleClick = (popupId: number, phaseType: 'AUCTION' | 'DRAW') => {
    router.push(
      phaseType === 'DRAW' ? `/draw/${popupId}` : `/auction/${popupId}`
    );
  };

  if (recommendedCards === null) return <RecommendSkeleton />;

  return (
    <Section
      title="팝콘님을 위한 팝업 추천"
      showButtonMore
      // TODO 더보기 작업 필요
      // onClickMore={handleClickMore}
    >
      {recommendedCards.length === 0 ? (
        <div className="min-h-[250px] flex items-center justify-center">
          추천 팝업이 없어요.
        </div>
      ) : (
        <GridCarousel
          gridSize={{
            default: 2,
            md: 3,
            lg: 4,
          }}
          carouselOpts={{ align: 'start' }}
          alignArrowToRatio="3/4"
          items={recommendedCards.map((recommendedCard) => {
            const likedState = getLikedPopupState(recommendedCard);

            return (
              <CardThumbnail
                key={`recommended-${recommendedCard.popupId}`}
                thumbnailUrl={recommendedCard.thumbnailUrl ?? undefined}
                thumbnailAlt={recommendedCard.caption ?? undefined}
                thumbnailRatio="3/4"
                title={recommendedCard.title}
                description={recommendedCard.subText ?? undefined}
                caption={recommendedCard.caption ?? undefined}
                countView={recommendedCard.stats.viewCount}
                countLike={likedState.likeCount}
                showButtonLike
                showCountView
                showCountLike
                // TODO 좋아요 작업 필요. 현재는 초기 표시 상태만 넘김
                isLiked={likedState.isLiked}
                onClickLike={() => handleClickLike(recommendedCard)}
                onClick={() =>
                  handleClick(
                    recommendedCard.popupId,
                    recommendedCard.phase.type
                  )
                }
              />
            );
          })}
        />
      )}
    </Section>
  );
};
