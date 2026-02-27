'use client';

import React from 'react';

import { CardThumbnail } from '@/components/common/card-thumbnail';
import {
  GridCarousel,
  ResponsiveGridSize,
} from '@/components/common/grid-carousel';
import { Section } from '../components/section';

const dummy = Array.from({ length: 10 }).map((_, index) => {
  return {
    id: index,
    title: `Title ${index}`,
    description: `Sub Text ${index}`,
    thumbnailUrl: 'https://placehold.co/300x300',
    caption: `Caption ${index}`,
    countView: 0,
    countLike: 0,
  };
});

interface CardSectionConfig {
  title: string;
  gridSize?: ResponsiveGridSize;
  thumbnailRatio?: '1/1' | '3/4' | '16/9';
  alignArrowToRatio?: '3/4' | '16/9' | '1/1' | 'auto';
}

export const createCardSection = ({
  title,
  gridSize,
  thumbnailRatio,
  alignArrowToRatio,
}: CardSectionConfig) => {
  return function CardSectionComponent() {
    const [items, setItems] = React.useState(dummy);

    const handleClick = (id: number) => {
      console.log('clicked item id: ', id);
    };

    const handleClickLike = (id: number) => {
      console.log('liked item id: ', id);
    };

    const handleClickMore = () => {
      console.log('more');
    };

    return (
      <Section title={title} showButtonMore onClickMore={handleClickMore}>
        <GridCarousel
          gridSize={gridSize}
          carouselOpts={{ align: 'start' }}
          alignArrowToRatio={alignArrowToRatio}
          items={items.map((entry) => (
            <CardThumbnail
              key={entry.id}
              thumbnailUrl={entry.thumbnailUrl}
              thumbnailRatio={thumbnailRatio}
              title={entry.title}
              description={entry.description}
              caption={entry.caption}
              countView={entry.countView}
              countLike={entry.countLike}
              showButtonLike
              showCountView
              showCountLike
              onClick={() => handleClick(entry.id)}
              onClickLike={() => handleClickLike(entry.id)}
            />
          ))}
        />
      </Section>
    );
  };
};
