'use client';

import React from 'react';

import { CardThumbnail } from '@/components/common/card-thumbnail';
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

export const EndingSoon = () => {
  const [item, setItems] = React.useState(dummy);

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
    <Section
      title="곧 종료되는 팝업"
      showButtonMore
      onClickMore={handleClickMore}
    >
      <GridCarousel
        gridSize={{
          default: 2,
          md: 3,
          lg: 5,
        }}
        carouselOpts={{ align: 'start' }}
        alignArrowToRatio="3/4"
        items={item.map((item) => (
          <CardThumbnail
            key={item.id}
            thumbnailUrl={item.thumbnailUrl}
            thumbnailRatio="3/4"
            title={item.title}
            description={item.description}
            caption={item.caption}
            countView={item.countView}
            countLike={item.countLike}
            showButtonLike
            showCountView
            showCountLike
            onClick={() => handleClick(item.id)}
            onClickLike={() => handleClickLike(item.id)}
          />
        ))}
      />
    </Section>
  );
};
