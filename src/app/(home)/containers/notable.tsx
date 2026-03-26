'use client';

import { useEffect, useState } from 'react';
import { CardThumbnail } from '@/components/content/card-thumbnail';
import { GridCarousel } from '@/components/content/grid-carousel';
import { Section } from '../components/section';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import { ApiResponse } from '@/types/api/common';
import { useRouter } from 'next/navigation';

interface NotableCard {
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

interface NotableCardResponse {
  sectionKey: 'FEATURED';
  itemCount: number;
  items: NotableCard[];
}

const NOTABLE_LIMIT = 10;

export const Notable = () => {
  const [notableCards, setNotableCards] = useState<NotableCard[] | null>(null);
  const accessToken = useAuthStore((state) => state.accessToken);
  const router = useRouter();

  useEffect(() => {
    const fetchNotable = async () => {
      try {
        const response = await fetch(
          `/api/popups/featured?limit=${NOTABLE_LIMIT}`,
          {
            method: 'GET',
            headers: {
              ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
            },
          }
        );

        if (!response.ok) return;

        const result =
          (await response.json()) as ApiResponse<NotableCardResponse>;
        setNotableCards(result.data?.items ?? []);
      } catch (error) {
        console.error('[recommend] 추천 팝업 조회 실패', error);
      }
    };
    fetchNotable();
    // NOTE 좋아요 기능 붙을 때를 위해 대비
  }, [accessToken]);

  if (notableCards === null) return;

  const handleClick = (popupId: number) => {
    router.push(`/featured/${popupId}`);
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
              key={notableCard.popupId}
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
              onClick={() => handleClick(notableCard.popupId)}
              // TODO 좋아요 작업 필요
              // onClickLike={() => handleClickLike(notableCard.popupId)}
            />
          ))}
        />
      )}
    </Section>
  );
};
