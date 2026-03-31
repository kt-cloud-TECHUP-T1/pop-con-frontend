'use client';

import { useEffect, useState } from 'react';
import { CardThumbnail } from '@/components/content/card-thumbnail';
import { GridCarousel } from '@/components/content/grid-carousel';
import { Section } from '../components/section';
import { ApiResponse } from '@/types/api/common';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import { RecommendSkeleton } from '../components/skeletons';
import { useRouter } from 'next/navigation';

interface RecommendedCard {
  popupId: number;
  title: string;
  supportingText: string | null;
  subText: string | null;
  caption: string | null;
  thumbnailUrl: string | null;
  liked: boolean | null;
  stats: {
    likeCount: number;
    viewCount: number;
  };
  overlay: null;
  phase: {
    type: 'AUCTION' | 'DRAW';
    status: 'UPCOMING' | 'OPEN' | 'CLOSED';
    openAt: string;
    closeAt: string;
  };
}

interface RecommendedCardResponse {
  sectionKey: 'RECOMMENDED';
  itemCount: number;
  items: RecommendedCard[];
}

export const Recommend = () => {
  const [recommendedCards, setRecommendedCards] = useState<
    RecommendedCard[] | null
  >(null);
  const accessToken = useAuthStore((state) => state.accessToken);
  const router = useRouter();

  useEffect(() => {
    const controller = new AbortController();

    const fetchRecommended = async () => {
      try {
        const response = await fetch('/api/popups/recommended', {
          method: 'GET',
          signal: controller.signal,
          headers: {
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
          },
        });

        if (!response.ok) {
          setRecommendedCards([]);
          return;
        }

        const result =
          (await response.json()) as ApiResponse<RecommendedCardResponse>;
        setRecommendedCards(result.data?.items ?? []);
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError')
          return;
        console.error('[recommend] 추천 팝업 조회 실패', error);
        setRecommendedCards([]);
      }
    };
    fetchRecommended();
    // NOTE 좋아요 기능 붙을 때를 위해 대비
    return () => controller.abort();
  }, [accessToken]);

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
          items={recommendedCards.map((recommendedCard) => (
            <CardThumbnail
              key={recommendedCard.popupId}
              thumbnailUrl={recommendedCard.thumbnailUrl ?? undefined}
              thumbnailAlt={recommendedCard.caption ?? undefined}
              thumbnailRatio="3/4"
              title={recommendedCard.title}
              description={recommendedCard.supportingText ?? undefined}
              caption={recommendedCard.caption ?? undefined}
              countView={recommendedCard.stats.viewCount}
              countLike={recommendedCard.stats.likeCount}
              showButtonLike
              showCountView
              showCountLike
              // TODO 좋아요 작업 필요. 현재는 초기 표시 상태만 넘김
              isLiked={recommendedCard.liked ?? false}
              onClick={() =>
                handleClick(recommendedCard.popupId, recommendedCard.phase.type)
              }
            />
          ))}
        />
      )}
    </Section>
  );
};
