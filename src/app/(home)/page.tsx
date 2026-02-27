'use client';

import { CardOverlay } from '@/components/common/card-overlay';
import { CardThumbnail } from '@/components/common/card-thumbnail';
import { GridCarousel } from '@/components/common/grid-carousel';
import { Section } from './components/section';
import { CategoryList } from './components/category-list';
import { Recommand } from './containers/recommand';
import { Ranking } from './containers/ranking';
import { DutchAuction } from './containers/dutch-auction';
import { LuckyDraw } from './containers/lucky-draw';
import { Magazine } from './containers/magazine';
import { Notable } from './containers/notable';
import { EndingSoon } from './containers/ending-soon';

export default function Home() {
  return (
    <div>
      <GridCarousel
        gridSize="auto"
        carouselOpts={{ loop: true }}
        showIndexes
        items={Array.from({ length: 10 }).map((_, index) => (
          <div className="w-[384px]">
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
      <CategoryList />
      <div className="container mx-auto">
        <Recommand />

        <Ranking />

        <DutchAuction />

        <LuckyDraw />

        <Magazine />

        <Notable />

        <EndingSoon />
      </div>
    </div>
  );
}
