'use client';

import { CardThumbnail } from '@/components/content/card-thumbnail';
import { GridCarousel } from '@/components/content/grid-carousel';
import { Section } from '../components/section';
import { useRouter } from 'next/navigation';
import { EndingSoonSkeleton } from '../components/skeletons';
import { useSectionFetch } from '../hooks/use-section-fetch';
import { usePopupLike } from '@/features/popups/hooks/use-popup-like';
import { FetchError } from '@/components/common/fetch-error';
import { NoContent } from '@/components/common/no-content';
import { getPopupHref } from '@/lib/utils';
import { BasePopupCard } from '../types';

const ENDING_SOON_LIMIT = 10;

export const EndingSoon = () => {
  const { data: endingSoonCards, isError } = useSectionFetch<BasePopupCard>(
    `/api/popups/ending-soon?limit=${ENDING_SOON_LIMIT}`
  );
  const { getLikedPopupState, handleClickLike } = usePopupLike<BasePopupCard>();
  const router = useRouter();

  if (isError) return <FetchError sectionTitle="곧 종료되는 팝업" />;
  if (endingSoonCards === null) return <EndingSoonSkeleton />;
  if (endingSoonCards.length === 0) {
    return (
      <NoContent
        title="곧 종료되는 팝업"
        message="곧 종료되는 팝업이 없어요."
      />
    );
  }

  return (
    <Section
      title="곧 종료되는 팝업"
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
        items={endingSoonCards.map((endingSoonCard) => {
          const likedState = getLikedPopupState(endingSoonCard);

          return (
            <CardThumbnail
              key={`ending-soon-${endingSoonCard.popupId}`}
              thumbnailUrl={endingSoonCard.thumbnailUrl ?? undefined}
              thumbnailRatio="3/4"
              title={endingSoonCard.title}
              description={endingSoonCard.subText ?? undefined}
              caption={endingSoonCard.caption ?? undefined}
              countView={endingSoonCard.stats?.viewCount || 0}
              countLike={likedState.likeCount}
              showButtonLike
              showCountView
              showCountLike
              onClick={() =>
                router.push(
                  getPopupHref(
                    endingSoonCard.popupId,
                    endingSoonCard.phase.type
                  )
                )
              }
              onClickLike={() => handleClickLike(endingSoonCard)}
              isLiked={likedState.isLiked}
            />
          );
        })}
      />
    </Section>
  );
};
