'use client';

import { CardThumbnail } from '@/components/content/card-thumbnail';
import { GridCarousel } from '@/components/content/grid-carousel';
import { Section } from '../components/section';
import { useRouter } from 'next/navigation';
import { EndingSoonSkeleton } from '../components/skeletons';
import { BasePopupCard } from '../types';
import { useSectionFetch } from '../hooks/use-section-fetch';

interface EndingSoonCard extends BasePopupCard {
  overlay: null;
  phase: {
    type: 'AUCTION' | 'DRAW';
    status: 'UPCOMING' | 'OPEN' | 'CLOSED';
    openAt: string;
    closeAt: string;
  };
}

const ENDING_SOON_LIMIT = 10;

export const EndingSoon = () => {
  const endingSoonCards = useSectionFetch<EndingSoonCard>(
    `/api/popups/ending-soon?limit=${ENDING_SOON_LIMIT}`
  );
  const router = useRouter();

  if (endingSoonCards === null) return <EndingSoonSkeleton />;

  const handleClick = (popupId: number, phaseType: 'AUCTION' | 'DRAW') => {
    if (phaseType === 'AUCTION') {
      router.push(`/auction/${popupId}`);
    } else {
      router.push(`/draw/${popupId}`);
    }
  };

  return (
    <Section
      title="곧 종료되는 팝업"
      showButtonMore
      // TODO 더보기 작업 필요
      // onClickMore={handleClickMore}
    >
      {endingSoonCards.length === 0 ? (
        <div className="min-h-[250px] flex items-center justify-center">
          곧 종료되는 팝업이 없어요.
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
          items={endingSoonCards.map((endingSoonCard) => (
            <CardThumbnail
              key={`ending-soon-${endingSoonCard.popupId}`}
              thumbnailUrl={endingSoonCard.thumbnailUrl ?? undefined}
              thumbnailRatio="3/4"
              title={endingSoonCard.title}
              description={endingSoonCard.subText ?? undefined}
              caption={endingSoonCard.caption ?? undefined}
              countView={endingSoonCard.stats.viewCount}
              countLike={endingSoonCard.stats.likeCount}
              showButtonLike
              showCountView
              showCountLike
              onClick={() => handleClick(endingSoonCard.popupId, endingSoonCard.phase.type)}
              // TODO 좋아요 작업 필요. 현재는 초기 표시 상태만 넘김
              isLiked={endingSoonCard.liked ?? false}
            />
          ))}
        />
      )}
    </Section>
  );
};
