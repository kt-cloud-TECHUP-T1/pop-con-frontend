'use client';

import { CardThumbnail } from '@/components/content/card-thumbnail';
import { GridCarousel } from '@/components/content/grid-carousel';
import { Section } from '../components/section';
import { RecommendSkeleton } from '../components/skeletons';
import { useRouter } from 'next/navigation';
import { BasePopupCard } from '../types';
import { useSectionFetch } from '../hooks/use-section-fetch';
import { usePopupLike } from '@/features/popups/hooks/use-popup-like';
import { FetchError } from '@/components/common/fetch-error';
import { NoContent } from '@/components/common/no-content';
import { getPopupHref } from '@/lib/utils';

export const Recommend = () => {
  const { data: recommendedCards, isError } = useSectionFetch<BasePopupCard>(
    '/api/popups/recommended'
  );
  const { getLikedPopupState, handleClickLike } = usePopupLike<BasePopupCard>();
  const router = useRouter();

  if (isError) return <FetchError sectionTitle="팝업 추천" />;
  if (recommendedCards === null) return <RecommendSkeleton />;
  if (recommendedCards.length === 0)
    return (
      <NoContent
        title="팝콘님을 위한 팝업 추천"
        message="추천 팝업이 없어요."
      />
    );

  return (
    <Section
      title="팝콘님을 위한 팝업 추천"
      showButtonMore
      // TODO 더보기 작업 필요
      // onClickMore={handleClickMore}
    >
      <GridCarousel
        gridSize={{
          default: 2,
          md: 3,
          lg: 4,
        }}
        carouselOpts={{ align: 'start', loop: true }}
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
              countView={recommendedCard.stats?.viewCount || 0}
              countLike={likedState.likeCount}
              showButtonLike
              showCountView
              showCountLike
              isLiked={likedState.isLiked}
              onClickLike={() => handleClickLike(recommendedCard)}
              onClick={() =>
                router.push(
                  getPopupHref(
                    recommendedCard.popupId,
                    recommendedCard.phase.type
                  )
                )
              }
            />
          );
        })}
      />
    </Section>
  );
};
