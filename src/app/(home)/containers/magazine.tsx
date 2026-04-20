'use client';

import { CardOverlay } from '@/components/content/card-overlay';
import { GridCarousel } from '@/components/content/grid-carousel';
import { Section } from '../components/section';
import { useRouter } from 'next/navigation';
import { MagazineSkeleton } from '../components/skeletons';
import { useSectionFetch } from '../hooks/use-section-fetch';
import { FetchError } from '@/components/common/fetch-error';
import { NoContent } from '@/components/common/no-content';

interface MagazineCard {
  magazineId: number;
  title: string | null;
  supportingText: string | null;
  thumbnailUrl: string | null;
}

const MAGAZINE_LIMIT = 3;

export const Magazine = () => {
  const { data: magazineCards, isError } = useSectionFetch<MagazineCard>(
    `/api/popups/magazines?limit=${MAGAZINE_LIMIT}`
  );
  const router = useRouter();

  if (isError) return <FetchError sectionTitle="매거진" />;
  if (magazineCards === null) return <MagazineSkeleton />;
  if (magazineCards.length === 0) {
    return <NoContent title="매거진" message="현재 매거진이 없어요." />;
  }

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
      <GridCarousel
        gridSize={{
          default: 1,
          md: 2,
          lg: 3,
        }}
        carouselOpts={{ align: 'start' }}
        items={magazineCards.map((magazineCard) => (
          <CardOverlay
            key={`magazine-${magazineCard.magazineId}`}
            thumbnailUrl={magazineCard.thumbnailUrl ?? undefined}
            thumbnailRatio="16/9"
            title={magazineCard.title ?? undefined}
            description={magazineCard.supportingText ?? undefined}
            onClick={() => handleClick(magazineCard.magazineId)}
          />
        ))}
      />
    </Section>
  );
};
