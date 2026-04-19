'use client';

import { CardThumbnail } from '@/components/content/card-thumbnail';
import { GridCarousel } from '@/components/content/grid-carousel';
import { Section } from '../components/section';
import { useRouter } from 'next/navigation';
import { NotableSkeleton } from '../components/skeletons';
import { BasePopupCard } from '../types';
import { useSectionFetch } from '../hooks/use-section-fetch';
import { usePopupLike } from '@/features/popups/hooks/use-popup-like';
import { FetchError } from '@/components/common/fetch-error';
import { NoContent } from '@/components/common/no-content';
import { getPopupHref } from '@/lib/utils';

interface NotableCard extends BasePopupCard {
  phase: {
    type: 'AUCTION' | 'DRAW';
    status: 'UPCOMING' | 'OPEN' | 'CLOSED';
    openAt: string;
    closeAt: string;
  };
}

const NOTABLE_LIMIT = 10;

export const Notable = () => {
  const { data: notableCards, isError } = useSectionFetch<NotableCard>(
    `/api/popups/featured?limit=${NOTABLE_LIMIT}`
  );
  const { getLikedPopupState, handleClickLike } = usePopupLike<NotableCard>();
  const router = useRouter();

  if (isError) return <FetchError sectionTitle="주목할 만한 팝업" />;
  if (notableCards === null) return <NotableSkeleton />;
  if (notableCards.length === 0) {
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
        carouselOpts={{ align: 'start', loop: true }}
        alignArrowToRatio="3/4"
        items={notableCards.map((notableCard) => {
          const likedState = getLikedPopupState(notableCard);

          return (
            <CardThumbnail
              key={`notable-${notableCard.popupId}`}
              thumbnailUrl={notableCard.thumbnailUrl ?? undefined}
              thumbnailRatio="3/4"
              title={notableCard.title}
              description={notableCard.subText ?? undefined}
              caption={notableCard.caption ?? undefined}
              countView={notableCard.stats?.viewCount || 0}
              countLike={likedState.likeCount}
              showButtonLike
              showCountView
              showCountLike
              isLiked={likedState.isLiked}
              onClickLike={() => handleClickLike(notableCard)}
              onClick={() =>
                router.push(
                  getPopupHref(notableCard.popupId, notableCard.phase.type)
                )
              }
            />
          );
        })}
      />
    </Section>
  );
};
