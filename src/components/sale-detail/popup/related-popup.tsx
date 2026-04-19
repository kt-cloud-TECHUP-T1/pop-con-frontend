'use client';

import { useRouter } from 'next/navigation';

import { Section } from '@/app/(home)/components/section';
import { usePopupLike } from '@/features/popups/hooks/use-popup-like';
import { useSectionFetch } from '@/app/(home)/hooks/use-section-fetch';
import { BasePopupCard } from '@/app/(home)/types';
import { CardThumbnail } from '@/components/content/card-thumbnail';
import { GridCarousel } from '@/components/content/grid-carousel';
import { NoContent } from '@/components/common/no-content';
import { getPopupHref } from '@/lib/utils';

interface RelatedPopupCard extends BasePopupCard {
  overlay: null;
}

const RELATED_POPUP_LIMIT = 10;

export const RelatedPopup = () => {
  const { data: relatedPopups, isError } = useSectionFetch<RelatedPopupCard>(
    `/api/popups/featured?limit=${RELATED_POPUP_LIMIT}`
  );
  const { getLikedPopupState, handleClickLike } =
    usePopupLike<RelatedPopupCard>();
  const router = useRouter();

  if (isError) return null;
  if (relatedPopups === null) return null;
  if (relatedPopups.length === 0) {
    return <NoContent message="주목할 만한 팝업이 아직 없어요." />;
  }

  return (
    <Section
      title="주목할 만한 팝업"
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
              countView={relatedPopup.stats?.viewCount || 0}
              countLike={likedState.likeCount}
              showButtonLike
              showCountView
              showCountLike
              isLiked={likedState.isLiked}
              onClickLike={() => handleClickLike(relatedPopup)}
              onClick={() =>
                router.push(
                  getPopupHref(relatedPopup.popupId, relatedPopup.phase.type)
                )
              }
            />
          );
        })}
      />
    </Section>
  );
};
