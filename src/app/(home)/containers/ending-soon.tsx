'use client';

import { useEffect, useState } from 'react';
import { CardThumbnail } from '@/components/content/card-thumbnail';
import { GridCarousel } from '@/components/content/grid-carousel';
import { Section } from '../components/section';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import { useRouter } from 'next/navigation';
import { ApiResponse } from '@/types/api/common';
import { EndingSoonSkeleton } from '../components/skeletons';

interface EndingSoonCard {
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

interface EndingSoonCardResponse {
  sectionKey: 'ENDING_SOON';
  itemCount: number;
  items: EndingSoonCard[];
}

const ENDING_SOON_LIMIT = 10;

export const EndingSoon = () => {
  const [endingSoonCards, setEndingSoonCards] = useState<
    EndingSoonCard[] | null
  >(null);
  const accessToken = useAuthStore((state) => state.accessToken);
  const router = useRouter();

  useEffect(() => {
    const controller = new AbortController();

    const fetchEndingSoon = async () => {
      try {
        const response = await fetch(
          `/api/popups/ending-soon?limit=${ENDING_SOON_LIMIT}`,
          {
            method: 'GET',
            signal: controller.signal,
            headers: {
              ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
            },
          }
        );

        if (!response.ok) {
          setEndingSoonCards([]);
          return;
        }

        const result =
          (await response.json()) as ApiResponse<EndingSoonCardResponse>;
        setEndingSoonCards(result.data?.items ?? []);
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError')
          return;
        console.error('[ending-soon] 곧 종료되는 팝업 조회 실패', error);
        setEndingSoonCards([]);
      }
    };
    fetchEndingSoon();
    // NOTE 좋아요 기능 붙을 때를 위해 대비
    return () => controller.abort();
  }, [accessToken]);

  if (endingSoonCards === null) return <EndingSoonSkeleton />;

  const handleClick = (popupId: number) => {
    router.push(`/ending-soon/${popupId}`);
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
              key={endingSoonCard.popupId}
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
              onClick={() => handleClick(endingSoonCard.popupId)}
              // TODO 좋아요 작업 필요
              // onClickLike={() => handleClickLike(item.id)}
            />
          ))}
        />
      )}
    </Section>
  );
};
