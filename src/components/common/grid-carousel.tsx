'use client';

import React from 'react';

import { cva } from 'class-variance-authority';

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselOptions,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';

export type GridSizeValue = 1 | 2 | 3 | 4 | 5 | 'auto';
export type ResponsiveGridSize =
  | GridSizeValue
  | {
      default?: GridSizeValue;
      sm?: GridSizeValue;
      md?: GridSizeValue;
      lg?: GridSizeValue;
      xl?: GridSizeValue;
      '2xl'?: GridSizeValue;
    };

const TAILWIND_SAFELIST = `
  basis-full basis-1/2 basis-1/3 basis-1/4 basis-1/5 basis-auto
  sm:basis-full sm:basis-1/2 sm:basis-1/3 sm:basis-1/4 sm:basis-1/5 sm:basis-auto
  md:basis-full md:basis-1/2 md:basis-1/3 md:basis-1/4 md:basis-1/5 md:basis-auto
  lg:basis-full lg:basis-1/2 lg:basis-1/3 lg:basis-1/4 lg:basis-1/5 lg:basis-auto
  xl:basis-full xl:basis-1/2 xl:basis-1/3 xl:basis-1/4 xl:basis-1/5 xl:basis-auto
  2xl:basis-full 2xl:basis-1/2 2xl:basis-1/3 2xl:basis-1/4 2xl:basis-1/5 2xl:basis-auto

  w-full w-1/2 w-1/3 w-1/4 w-1/5
  sm:w-full sm:w-1/2 sm:w-1/3 sm:w-1/4 sm:w-1/5
  md:w-full md:w-1/2 md:w-1/3 md:w-1/4 md:w-1/5
  lg:w-full lg:w-1/2 lg:w-1/3 lg:w-1/4 lg:w-1/5
  xl:w-full xl:w-1/2 xl:w-1/3 xl:w-1/4 xl:w-1/5
  2xl:w-full 2xl:w-1/2 2xl:w-1/3 2xl:w-1/4 2xl:w-1/5
`;

const getResponsiveClasses = (
  gridSize: ResponsiveGridSize,
  type: 'basis' | 'width'
) => {
  const generateClass = (bp: string, size: GridSizeValue) => {
    const prefix = bp === 'default' ? '' : `${bp}:`;
    const target = type === 'basis' ? 'basis' : 'w';

    // auto 사이즈 예외 처리
    if (size === 'auto') {
      return type === 'basis' ? `${prefix}basis-auto` : `${prefix}w-full`;
    }

    // GridSizeValue 로직 처리 (1일 땐 full, 나머지는 1/x 비율)
    const fraction = size === 1 ? 'full' : `1/${size}`;
    return `${prefix}${target}-${fraction}`;
  };

  if (typeof gridSize !== 'object' || gridSize === null) {
    return generateClass('default', gridSize);
  }

  return cn(
    Object.entries(gridSize).map(([bp, size]) =>
      generateClass(bp, size as GridSizeValue)
    )
  );
};

const carouselArrowWrapperVariants = cva('relative', {
  variants: {
    alignArrowToRatio: {
      '16/9': 'aspect-video',
      '1/1': 'aspect-square',
      '3/4': 'aspect-[3/4]',
      auto: '',
    },
  },
});

export interface GridCarouselProps {
  gridSize?: ResponsiveGridSize;
  items: React.ReactNode[];
  carouselOpts?: CarouselOptions;
  showArrows?: boolean;
  showIndexes?: boolean;
  alignArrowToRatio?: '3/4' | '16/9' | '1/1' | 'auto';
}

export const GridCarousel: React.FC<GridCarouselProps> = ({
  gridSize = 4,
  items,
  carouselOpts,
  showArrows = true,
  showIndexes,
  alignArrowToRatio = 'auto',
}) => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  const basisClass = getResponsiveClasses(gridSize, 'basis');
  const widthClass = getResponsiveClasses(gridSize, 'width');

  const isAutoGridSize =
    gridSize === 'auto' ||
    (typeof gridSize === 'object' &&
      gridSize !== null &&
      Object.values(gridSize).includes('auto'));

  const wrapperClass = cn(
    carouselArrowWrapperVariants({ alignArrowToRatio }),
    widthClass,
    (alignArrowToRatio === 'auto' || isAutoGridSize) && 'h-full'
  );

  const arrowClasses = cva(
    'size-12 min-w-auto min-h-auto outline-1 -outline-offset-1 inline-flex justify-center items-center gap-2 overflow-hidden shadow-[0px_2px_8px_0px_rgba(0,0,0,0.12)] bg-white pointer-events-auto',
    {
      variants: {
        position: {
          left: 'left-0 xl:-left-6',
          right: 'right-0 xl:-right-6',
        },
      },
    }
  );

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <Carousel className="w-full" opts={carouselOpts} setApi={setApi}>
      <CarouselContent className="-ml-m">
        {items.map((item, index) => (
          <CarouselItem key={index} className={cn('pl-m', basisClass)}>
            <CarouselItem className="pl-0">{item}</CarouselItem>
          </CarouselItem>
        ))}
      </CarouselContent>
      {showArrows && (
        <div
          className={cn(
            'container absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none z-10 flex justify-between',
            alignArrowToRatio !== 'auto' && !isAutoGridSize
              ? 'h-auto'
              : 'h-full'
          )}
        >
          <div className={wrapperClass}>
            <CarouselPrevious className={arrowClasses({ position: 'left' })} />
          </div>
          <div className={wrapperClass}>
            <CarouselNext className={arrowClasses({ position: 'right' })} />
          </div>
        </div>
      )}
      {showIndexes && (
        <div className="flex justify-center items-center gap-2 mt-6">
          {Array.from({ length: items.length }).map((_, index) => (
            <div
              key={index}
              className={cn(
                'size-2.5 rounded-full bg-neutral-900 opacity-15',
                current === index + 1 && 'bg-neutral-700 opacity-100'
              )}
            >
              <span className="sr-only">{index + 1}</span>
            </div>
          ))}
        </div>
      )}
    </Carousel>
  );
};
