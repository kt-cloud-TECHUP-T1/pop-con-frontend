'use client';

import { CardOverlay } from '@/components/content/card-overlay';
import { GridCarousel } from '@/components/content/grid-carousel';
import { useRouter } from 'next/navigation';
import { MainBannerSkeleton } from '../components/skeletons';
import { useSectionFetch } from '../hooks/use-section-fetch';
import { PopupPhase } from '../types';

interface BannerCard {
  popupId: number;
  title: string;
  supportingText: string | null;
  subText: string | null;
  caption: string | null;
  thumbnailUrl: string | null;
  liked: boolean | null;
  stats: null;
  overlay: null;
  phase: PopupPhase;
}

const BANNER_LIMIT = 5;

export const MainBanner = () => {
  const bannerCards = useSectionFetch<BannerCard>(
    `/api/popups/banners?limit=${BANNER_LIMIT}`
  );
  const router = useRouter();

  if (bannerCards === null) return <MainBannerSkeleton />;

  if (bannerCards.length === 0) return null;

  const handleBannersClick = (
    popupId: number,
    phaseType: 'AUCTION' | 'DRAW'
  ) => {
    if (phaseType === 'AUCTION') {
      router.push(`/auction/${popupId}`);
    } else {
      router.push(`/draw/${popupId}`);
    }
  };

  return (
    <GridCarousel
      gridSize="auto"
      carouselOpts={{ loop: true, align: 'center' }}
      contentWrapperClassName="overflow-visible"
      contentClassName="justify-center"
      showIndexes
      items={bannerCards.map((bannerCard) => (
        <div key={`banner-${bannerCard.popupId}`} className="w-[384px]">
          <CardOverlay
            thumbnailUrl={bannerCard.thumbnailUrl ?? undefined}
            thumbnailAlt={bannerCard.title}
            title={bannerCard.title}
            description={bannerCard.supportingText ?? undefined}
            caption={bannerCard.caption ?? undefined}
            onClick={() =>
              handleBannersClick(bannerCard.popupId, bannerCard.phase.type)
            }
          />
        </div>
      ))}
    />
  );
};
