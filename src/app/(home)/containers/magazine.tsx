'use client';

import { useEffect, useState } from 'react';
import { CardOverlay } from '@/components/content/card-overlay';
import { GridCarousel } from '@/components/content/grid-carousel';
import { Section } from '../components/section';
import { useRouter } from 'next/navigation';
import { ApiResponse } from '@/types/api/common';
import { MagazineSkeleton } from '../components/skeletons';

interface MagazineCard {
  magazineId: number;
  title: string | null;
  supportingText: string | null;
  thumbnailUrl: string | null;
}

interface MagazineCardResponse {
  sectionKey: 'MAGAZINES';
  itemCount: number;
  items: MagazineCard[];
}

const MAGAZINE_LIMIT = 3;

export const Magazine = () => {
  const [magazineCards, setMagazineCards] = useState<MagazineCard[] | null>(
    null
  );
  const router = useRouter();

  useEffect(() => {
    const fetchNotable = async () => {
      try {
        const response = await fetch(
          `/api/popups/magazines?limit=${MAGAZINE_LIMIT}`,
          {
            method: 'GET',
          }
        );

        if (!response.ok) {
          setMagazineCards([]);
          return;
        }

        const result =
          (await response.json()) as ApiResponse<MagazineCardResponse>;
        setMagazineCards(result.data?.items ?? []);
      } catch (error) {
        console.error('[magazine] 매거진 조회 실패', error);
        setMagazineCards([]);
      }
    };
    fetchNotable();
  }, []);

  if (magazineCards === null) return <MagazineSkeleton />;

  const handleClick = (magazineId: number) => {
    router.push(`/magazines/${magazineId}`);
  };

  return (
    <Section
      id="magazine"
      title="매거진"
      showButtonMore
      // TODO 더보기 작업 필요
      //onClickMore={handleClickMore}
    >
      {magazineCards.length === 0 ? (
        <div className="min-h-[250px] flex items-center justify-center">
          현재 매거진이 없어요.
        </div>
      ) : (
        <GridCarousel
          gridSize={{
            default: 1,
            md: 2,
            lg: 3,
          }}
          carouselOpts={{ align: 'start' }}
          items={magazineCards.map((magazineCard) => (
            <CardOverlay
              key={magazineCard.magazineId}
              thumbnailUrl={magazineCard.thumbnailUrl ?? undefined}
              thumbnailRatio="16/9"
              title={magazineCard.title ?? undefined}
              description={magazineCard.supportingText ?? undefined}
              onClick={() => handleClick(magazineCard.magazineId)}
            />
          ))}
        />
      )}
    </Section>
  );
};
