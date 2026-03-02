'use client';

import React from 'react';

import { CardOverlay } from '@/components/common/card-overlay';
import { GridCarousel } from '@/components/common/grid-carousel';
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

export const Magazine = () => {
  const [item, setItems] = React.useState(dummy);

  const handleClick = (id: number) => {
    console.log('clicked item id: ', id);
  };

  const handleClickMore = () => {
    console.log('more');
  };

  return (
    <Section title="매거진" showButtonMore onClickMore={handleClickMore}>
      <GridCarousel
        gridSize={{
          default: 1,
          md: 2,
          lg: 4,
        }}
        carouselOpts={{ align: 'start' }}
        items={item.map((item) => (
          <CardOverlay
            key={item.id}
            thumbnailUrl={item.thumbnailUrl}
            thumbnailRatio="16/9"
            title={item.title}
            description={item.description}
            caption={item.caption}
            onClick={() => handleClick(item.id)}
          />
        ))}
      />
    </Section>
  );
};
