'use client';

import { CardOverlay } from '@/components/content/card-overlay';
import { GridCarousel } from '@/components/content/grid-carousel';
import type { ApiResponse } from '@/types/api/common';
import { useEffect, useState } from 'react';

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
  phase: {
    type: 'AUCTION' | 'DRAW';
    status: 'UPCOMING' | 'OPEN' | 'CLOSED';
    openAt: string;
    closeAt: string;
  };
}

interface BannerCardResponse {
  sectionKey: 'BANNERS';
  itemCount: number;
  items: BannerCard[];
}

const BANNER_LIMIT = 5;

export const MainBanner = () => {
  const [bannerCards, setBannerCards] = useState<BannerCard[] | null>(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch(
          `/api/popups/banners?limit=${BANNER_LIMIT}`,
          {
            method: 'GET',
          }
        );

        if (!response.ok) return;

        const result =
          (await response.json()) as ApiResponse<BannerCardResponse>;
        setBannerCards(result.data?.items ?? []);
      } catch (error) {
        console.error('[banner] 배너 조회 실패', error);
      }
    };
    fetchBanners();
  }, []);

  if (bannerCards === null) return null;

  if (bannerCards.length === 0) return null;

  return (
    <GridCarousel
      gridSize="auto"
      carouselOpts={{ loop: true }}
      showIndexes
      items={bannerCards.map((bannerCard) => (
        <div key={bannerCard.popupId} className="w-[384px]">
          {/* TODO 카드 클릭 작업 필요 */}
          <CardOverlay
            thumbnailUrl={bannerCard.thumbnailUrl ?? undefined}
            thumbnailAlt={bannerCard.title}
            title={bannerCard.title}
            description={bannerCard.supportingText ?? undefined}
            caption={bannerCard.caption ?? undefined}
            onClick={() => {}}
          />
        </div>
      ))}
    />
  );
};
