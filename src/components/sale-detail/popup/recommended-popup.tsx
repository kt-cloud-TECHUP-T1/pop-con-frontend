'use client';

import { useRouter } from 'next/navigation';

import { Section } from '@/app/(home)/components/section';
import { usePopupLike } from '@/app/(home)/hooks/use-popup-like';
import { useSectionFetch } from '@/app/(home)/hooks/use-section-fetch';
import { BasePopupCard } from '@/app/(home)/types';
import { CardThumbnail } from '@/components/content/card-thumbnail';
import { GridCarousel } from '@/components/content/grid-carousel';

interface RecommendedPopupCard extends BasePopupCard {
  overlay: null;
}

export const RecommendedPopup = () => {
  const recommendedPopups =
    useSectionFetch<RecommendedPopupCard>('/api/popups/recommended');
  const { getLikedPopupState, handleClickLike } =
    usePopupLike<RecommendedPopupCard>();
  const router = useRouter();

  const handleClick = (popupId: number, phaseType: 'AUCTION' | 'DRAW') => {
    router.push(
      phaseType === 'DRAW' ? `/draw/${popupId}` : `/auction/${popupId}`
    );
  };

  if (recommendedPopups === null) return null;

  return (
    <Section
      title="팝콘님을 위한 추천 팝업"
      showButtonMore
      // TODO 더보기 작업 필요
      // onClickMore={handleClickMore}
    >
      {recommendedPopups.length === 0 ? (
        <div className="min-h-[250px] flex items-center justify-center">
          추천 팝업이 없어요.
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
          items={recommendedPopups.map((recommendedPopup) => {
            const likedState = getLikedPopupState(recommendedPopup);

            return (
              <CardThumbnail
                key={`recommended-${recommendedPopup.popupId}`}
                thumbnailUrl={recommendedPopup.thumbnailUrl ?? undefined}
                thumbnailAlt={recommendedPopup.caption ?? undefined}
                thumbnailRatio="3/4"
                title={recommendedPopup.title}
                description={recommendedPopup.subText ?? undefined}
                caption={recommendedPopup.caption ?? undefined}
                countView={recommendedPopup.stats.viewCount}
                countLike={likedState.likeCount}
                showButtonLike
                showCountView
                showCountLike
                isLiked={likedState.isLiked}
                onClickLike={() => handleClickLike(recommendedPopup)}
                onClick={() =>
                  handleClick(
                    recommendedPopup.popupId,
                    recommendedPopup.phase.type
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
