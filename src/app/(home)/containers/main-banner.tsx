// ================================================
// 관련 파일
// api route: api/popups/banners/route.ts
// api mock data: mock-banner-items.ts
// 조회 서비스 함수: features/home/services/get-home-banners.ts
// 응답 타입: types/api/home.ts
// ================================================

'use client';

import { CardOverlay } from '@/components/content/card-overlay';
import { GridCarousel } from '@/components/content/grid-carousel';

export const MainBanner = () => {
  return (
    <GridCarousel
      gridSize="auto"
      carouselOpts={{ loop: true }}
      showIndexes
      items={Array.from({ length: 10 }).map((_, index) => (
        <div key={index} className="w-[384px]">
          <CardOverlay
            thumbnailUrl="https://placehold.co/300x300"
            title="Title"
            description="Sub Text"
            caption="Caption"
            onClick={() => {
              console.log('click');
            }}
          />
        </div>
      ))}
    />
  );
};
