'use client';

import { CardThumbnail } from '@/components/content/card-thumbnail';
import { GridCarousel } from '@/components/content/grid-carousel';
import { Section } from '../components/section';
import { useRouter } from 'next/navigation';
import { NotableSkeleton } from '../components/skeletons';
import { BasePopupCard } from '../types';
import { useSectionFetch } from '../hooks/use-section-fetch';

interface NotableCard extends BasePopupCard {
  overlay: null;
  phase: {
    type: 'AUCTION' | 'DRAW';
    status: 'UPCOMING' | 'OPEN' | 'CLOSED';
    openAt: string;
    closeAt: string;
  };
}

const NOTABLE_LIMIT = 10;

export const Notable = () => {
  const notableCards = useSectionFetch<NotableCard>(
    `/api/popups/featured?limit=${NOTABLE_LIMIT}`
  );
  const router = useRouter();

  if (notableCards === null) return <NotableSkeleton />;

  const handleClick = (popupId: number, phaseType: 'AUCTION' | 'DRAW') => {
    if (phaseType === 'AUCTION') {
      router.push(`/auction/${popupId}`);
    } else {
      router.push(`/draw/${popupId}`);
    }
  };

  return (
    <Section
      title="주목할 만한 팝업"
      showButtonMore
      // TODO 더보기 작업 필요
      // onClickMore={handleClickMore}
    >
      {notableCards.length === 0 ? (
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
          items={notableCards.map((notableCard) => (
            <CardThumbnail
              key={`notable-${notableCard.popupId}`}
              thumbnailUrl={notableCard.thumbnailUrl ?? undefined}
              thumbnailRatio="3/4"
              title={notableCard.title}
              description={notableCard.subText ?? undefined}
              caption={notableCard.caption ?? undefined}
              countView={notableCard.stats.viewCount}
              countLike={notableCard.stats.likeCount}
              showButtonLike
              showCountView
              showCountLike
              // TODO 좋아요 작업 필요. 현재는 초기 표시 상태만 넘김
              isLiked={notableCard.liked ?? false}
              onClick={() =>
                handleClick(notableCard.popupId, notableCard.phase.type)
              }
            />
          ))}
        />
      )}
    </Section>
  );
};
