'use client';

import { useRouter } from 'next/navigation';

import { Section } from '@/app/(home)/components/section';
import { usePopupLike } from '@/app/(home)/hooks/use-popup-like';
import { useSectionFetch } from '@/app/(home)/hooks/use-section-fetch';
import { BasePopupCard } from '@/app/(home)/types';
import { CardThumbnail } from '@/components/content/card-thumbnail';
import { GridCarousel } from '@/components/content/grid-carousel';

interface RelatedPopupCard extends BasePopupCard {
  overlay: null;
}

const RELATED_POPUP_LIMIT = 10;

export const RelatedPopup = () => {
  const relatedPopups = useSectionFetch<RelatedPopupCard>(
    `/api/popups/featured?limit=${RELATED_POPUP_LIMIT}`
  );
  const { getLikedPopupState, handleClickLike } =
    usePopupLike<RelatedPopupCard>();
  const router = useRouter();

  const handleClick = (popupId: number, phaseType: 'AUCTION' | 'DRAW') => {
    router.push(
      phaseType === 'DRAW' ? `/draw/${popupId}` : `/auction/${popupId}`
    );
  };

  if (relatedPopups === null) return null;

  return (
    <Section
      title="주목할 만한 팝업"
      showButtonMore
      // TODO 더보기 작업 필요
      // onClickMore={handleClickMore}
    >
      {relatedPopups.length === 0 ? (
        <div className="min-h-[250px] flex items-center justify-center">
          주목할 만한 팝업이 아직 없어요.
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
          items={relatedPopups.map((relatedPopup) => {
            const likedState = getLikedPopupState(relatedPopup);

            return (
              <CardThumbnail
                key={`related-${relatedPopup.popupId}`}
                thumbnailUrl={relatedPopup.thumbnailUrl ?? undefined}
                thumbnailRatio="3/4"
                title={relatedPopup.title}
                description={relatedPopup.subText ?? undefined}
                caption={relatedPopup.caption ?? undefined}
                countView={relatedPopup.stats.viewCount}
                countLike={likedState.likeCount}
                showButtonLike
                showCountView
                showCountLike
                isLiked={likedState.isLiked}
                onClickLike={() => handleClickLike(relatedPopup)}
                onClick={() =>
                  handleClick(relatedPopup.popupId, relatedPopup.phase.type)
                }
              />
            );
          })}
        />
      )}
    </Section>
  );
};
