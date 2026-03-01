import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { GridCarousel } from './grid-carousel';
import { CardThumbnail } from './card-thumbnail';

const meta: Meta<typeof GridCarousel> = {
  title: 'Common/GridCarousel',
  component: GridCarousel,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    gridSize: {
      control: 'select',
      options: [1, 2, 3, 4, 5, 'auto'],
      description: '한 행에 보여질 아이템의 개수 또는 반응형 설정입니다.',
    },
    showArrows: {
      control: 'boolean',
      description: '좌우 이동 화살표 표시 여부입니다.',
    },
    showIndexes: {
      control: 'boolean',
      description: '하단 인디케이터(점) 표시 여부입니다.',
    },
    alignArrowToRatio: {
      control: 'select',
      options: ['3/4', '16/9', '1/1', 'auto'],
      description: '화살표의 수직 중앙 정렬 기준이 될 비율입니다.',
    },
    carouselOpts: {
      control: 'object',
      description:
        'Carousel 옵션입니다. 참고: https://www.embla-carousel.com/api/options/',
    },
  },
};

export default meta;

type Story = StoryObj<typeof GridCarousel>;

// Carousel에 넣을 임의의 아이템들을 생성하는 함수
const generateCards = (
  count: number,
  ratio: '1/1' | '3/4' | '16/9' = '3/4'
) => {
  return Array.from({ length: count }).map((_, i) => (
    <CardThumbnail
      key={i}
      thumbnailUrl="/images/temp/God-Sang-hyeok.png"
      thumbnailRatio={ratio}
      title={`캐러셀 아이템 ${i + 1}`}
      label="GridCard"
    />
  ));
};

export const Default: Story = {
  args: {
    gridSize: 4,
    items: generateCards(8),
    showArrows: true,
    showIndexes: true,
    alignArrowToRatio: '3/4',
  },
};

export const Responsive: Story = {
  args: {
    gridSize: { default: 2, md: 3, lg: 4, xl: 5 },
    items: generateCards(15),
    showArrows: true,
    showIndexes: true,
    alignArrowToRatio: '3/4',
  },
  parameters: {
    docs: {
      description: {
        story:
          '해상도(`default`, `md`, `lg`, `xl`)에 따라 표시되는 아이템 수가 변하는 반응형 캐러셀입니다.',
      },
    },
  },
};

export const DifferentRatios: Story = {
  args: {
    gridSize: 3,
    items: generateCards(6, '16/9'),
    showArrows: true,
    showIndexes: true,
    alignArrowToRatio: '16/9',
  },
  parameters: {
    docs: {
      description: {
        story:
          '16/9 비율 카드를 사용하고 화살표도 16/9 비율 중앙에 맞춘 캐러셀입니다.',
      },
    },
  },
};
