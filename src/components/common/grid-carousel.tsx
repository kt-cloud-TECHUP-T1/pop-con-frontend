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
import { cva } from 'class-variance-authority';
import React from 'react';

const carouselItemVariants = cva('pl-m', {
  variants: {
    gridSize: {
      2: 'basis-1/2',
      3: 'basis-1/3',
      4: 'basis-1/4',
      5: 'basis-1/5',
      auto: 'basis-auto',
    },
  },
});

export interface GridCarouselProps {
  gridSize?: 2 | 3 | 4 | 5 | 'auto';
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

  const arrowStyle = React.useMemo(() => {
    if (
      alignArrowToRatio &&
      alignArrowToRatio !== 'auto' &&
      gridSize !== 'auto'
    ) {
      const [w, h] = alignArrowToRatio.split('/').map(Number);
      return { aspectRatio: `${gridSize * w} / ${h}` };
    }
    return undefined;
  }, [alignArrowToRatio, gridSize]);

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
          <CarouselItem
            key={index}
            className={cn(carouselItemVariants({ gridSize }))}
          >
            <CarouselItem className="pl-0">{item}</CarouselItem>
          </CarouselItem>
        ))}
      </CarouselContent>
      {showArrows && (
        <div
          className={cn(
            'container absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none z-10',
            alignArrowToRatio &&
              alignArrowToRatio !== 'auto' &&
              gridSize !== 'auto'
              ? 'h-auto'
              : 'h-full'
          )}
          style={arrowStyle}
        >
          <CarouselPrevious className="size-12 min-w-auto min-h-auto outline-1 -outline-offset-1 inline-flex justify-center items-center gap-2 overflow-hidden shadow-[0px_2px_8px_0px_rgba(0,0,0,0.12)] -left-6 bg-white pointer-events-auto" />
          <CarouselNext className="size-12 min-w-auto min-h-auto outline-1 -outline-offset-1 inline-flex justify-center items-center gap-2 overflow-hidden shadow-[0px_2px_8px_0px_rgba(0,0,0,0.12)] -right-6 bg-white pointer-events-auto" />
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
