'use client';

import { CardOverlay } from '@/components/content/card-overlay';
import { GridCarousel } from '@/components/content/grid-carousel';
import { MainBannerSkeleton } from '../components/skeletons';
import { useSectionFetch } from '../hooks/use-section-fetch';
import { BasePopupCard } from '../types';
import { FetchError } from '@/components/common/fetch-error';
import { useRouter } from 'next/navigation';
import { getPopupHref } from '@/lib/utils';

const BANNER_LIMIT = 5;

export const MainBanner = () => {
  const { data: bannerCards, isError } = useSectionFetch<BasePopupCard>(
    `/api/popups/banners?limit=${BANNER_LIMIT}`
  );
  const router = useRouter();

  if (isError) return <FetchError sectionTitle="메인 배너" />;
  if (bannerCards === null) return <MainBannerSkeleton />;
  if (bannerCards.length === 0) return null;

  return (
    <GridCarousel
      gridSize="auto"
      carouselOpts={{ loop: true, align: 'center' }}
      showIndexes
      contentClassName="max-w-[1536px] mx-auto"
      items={bannerCards.map((bannerCard) => (
        <div key={`banner-${bannerCard.popupId}`} className="w-[384px]">
          <CardOverlay
            thumbnailUrl={bannerCard.thumbnailUrl ?? undefined}
            thumbnailAlt={bannerCard.title}
            title={bannerCard.title}
            description={bannerCard.supportingText ?? undefined}
            caption={bannerCard.caption ?? undefined}
            onClick={() =>
              router.push(
                getPopupHref(bannerCard.popupId, bannerCard.phase.type)
              )
            }
          />
        </div>
      ))}
    />
  );
};
