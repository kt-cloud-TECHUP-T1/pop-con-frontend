'use client';

import { CardOverlay } from '@/components/common/card-overlay';
import { CardThumbnail } from '@/components/common/card-thumbnail';
import { GridCarousel } from '@/components/common/grid-carousel';
import { Section } from './components/section';
import { CategoryList } from './components/category-list';

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
        <Section title="팝콘님을 위한 팝업 추천" showButtonMore>
          <GridCarousel
            gridSize={4}
            carouselOpts={{ align: 'start' }}
            items={Array.from({ length: 10 }).map((_, index) => (
              <CardThumbnail
                thumbnailUrl="https://placehold.co/300x300"
                title="Title"
                description="Sub Text"
                caption="Caption"
                countView={0}
                countLike={0}
                showButtonLike
                showCountView
                showCountLike
                onClick={() => {
                  console.log('click');
                }}
                onClickLike={() => {
                  console.log('clickLike');
                }}
              />
            ))}
          />
        </Section>

        <Section title="팝콘 랭킹" showButtonMore>
          <GridCarousel
            gridSize={5}
            carouselOpts={{ align: 'start' }}
            items={Array.from({ length: 10 }).map((_, index) => (
              <CardThumbnail
                thumbnailUrl="https://placehold.co/300x300"
                index={index + 1}
                title="Title"
                description="Sub Text"
                caption="Caption"
                countView={0}
                countLike={0}
                showButtonLike
                showCountView
                showCountLike
                onClick={() => {
                  console.log('click');
                }}
                onClickLike={() => {
                  console.log('clickLike');
                }}
              />
            ))}
          />
        </Section>

        <Section title="더치 경매">
          <GridCarousel
            gridSize={2}
            carouselOpts={{ align: 'start' }}
            items={Array.from({ length: 10 }).map((_, index) => (
              <CardThumbnail
                thumbnailUrl="https://placehold.co/300x300"
                thumbnailRatio="16/9"
                title="Title"
                description="Sub Text"
                caption="Caption"
                countView={0}
                countLike={0}
                showButtonLike
                showCountView
                showCountLike
                onClick={() => {
                  console.log('click');
                }}
                onClickLike={() => {
                  console.log('clickLike');
                }}
              />
            ))}
          />
        </Section>

        <Section title="드로우" showButtonMore>
          <GridCarousel
            gridSize={4}
            carouselOpts={{ align: 'start' }}
            items={Array.from({ length: 10 }).map((_, index) => (
              <CardThumbnail
                thumbnailUrl="https://placehold.co/300x300"
                label="2.23(월) 10:30 오픈"
                title="Title"
                description="Sub Text"
                caption="Caption"
                countView={0}
                countLike={0}
                showButtonLike
                showCountView
                showCountLike
                onClick={() => {
                  console.log('click');
                }}
                onClickLike={() => {
                  console.log('clickLike');
                }}
              />
            ))}
          />
        </Section>

        <Section title="매거진" showButtonMore>
          <GridCarousel
            gridSize={3}
            carouselOpts={{ align: 'start' }}
            items={Array.from({ length: 10 }).map((_, index) => (
              <CardOverlay
                thumbnailUrl="https://placehold.co/300x300"
                thumbnailRatio="16/9"
                title="Title"
                description="Sub Text"
                caption="Caption"
                onClick={() => {
                  console.log('click');
                }}
              />
            ))}
          />
        </Section>

        <Section title="주목할 만한 팝업" showButtonMore>
          <GridCarousel
            gridSize={5}
            carouselOpts={{ align: 'start' }}
            items={Array.from({ length: 10 }).map((_, index) => (
              <CardThumbnail
                thumbnailUrl="https://placehold.co/300x300"
                title="Title"
                description="Sub Text"
                caption="Caption"
                countView={0}
                countLike={0}
                showButtonLike
                showCountView
                showCountLike
                onClick={() => {
                  console.log('click');
                }}
                onClickLike={() => {
                  console.log('clickLike');
                }}
              />
            ))}
          />
        </Section>

        <Section title="곧 종료되는 팝업" showButtonMore>
          <GridCarousel
            gridSize={5}
            carouselOpts={{ align: 'start' }}
            items={Array.from({ length: 10 }).map((_, index) => (
              <CardThumbnail
                thumbnailUrl="https://placehold.co/300x300"
                title="Title"
                description="Sub Text"
                caption="Caption"
                countView={0}
                countLike={0}
                showButtonLike
                showCountView
                showCountLike
                onClick={() => {
                  console.log('click');
                }}
                onClickLike={() => {
                  console.log('clickLike');
                }}
              />
            ))}
          />
        </Section>
      </div>
    </div>
  );
}
