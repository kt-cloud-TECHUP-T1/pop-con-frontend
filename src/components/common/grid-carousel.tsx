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

const basisClasses = {
  default: {
    1: 'basis-full',
    2: 'basis-1/2',
    3: 'basis-1/3',
    4: 'basis-1/4',
    5: 'basis-1/5',
    auto: 'basis-auto',
  },
  sm: {
    1: 'sm:basis-full',
    2: 'sm:basis-1/2',
    3: 'sm:basis-1/3',
    4: 'sm:basis-1/4',
    5: 'sm:basis-1/5',
    auto: 'sm:basis-auto',
  },
  md: {
    1: 'md:basis-full',
    2: 'md:basis-1/2',
    3: 'md:basis-1/3',
    4: 'md:basis-1/4',
    5: 'md:basis-1/5',
    auto: 'md:basis-auto',
  },
  lg: {
    1: 'lg:basis-full',
    2: 'lg:basis-1/2',
    3: 'lg:basis-1/3',
    4: 'lg:basis-1/4',
    5: 'lg:basis-1/5',
    auto: 'lg:basis-auto',
  },
  xl: {
    1: 'xl:basis-full',
    2: 'xl:basis-1/2',
    3: 'xl:basis-1/3',
    4: 'xl:basis-1/4',
    5: 'xl:basis-1/5',
    auto: 'xl:basis-auto',
  },
  '2xl': {
    1: '2xl:basis-full',
    2: '2xl:basis-1/2',
    3: '2xl:basis-1/3',
    4: '2xl:basis-1/4',
    5: '2xl:basis-1/5',
    auto: '2xl:basis-auto',
  },
};

const widthClasses = {
  default: {
    1: 'w-full',
    2: 'w-1/2',
    3: 'w-1/3',
    4: 'w-1/4',
    5: 'w-1/5',
    auto: 'w-full',
  },
  sm: {
    1: 'sm:w-full',
    2: 'sm:w-1/2',
    3: 'sm:w-1/3',
    4: 'sm:w-1/4',
    5: 'sm:w-1/5',
    auto: 'sm:w-full',
  },
  md: {
    1: 'md:w-full',
    2: 'md:w-1/2',
    3: 'md:w-1/3',
    4: 'md:w-1/4',
    5: 'md:w-1/5',
    auto: 'md:w-full',
  },
  lg: {
    1: 'lg:w-full',
    2: 'lg:w-1/2',
    3: 'lg:w-1/3',
    4: 'lg:w-1/4',
    5: 'lg:w-1/5',
    auto: 'lg:w-full',
  },
  xl: {
    1: 'xl:w-full',
    2: 'xl:w-1/2',
    3: 'xl:w-1/3',
    4: 'xl:w-1/4',
    5: 'xl:w-1/5',
    auto: 'xl:w-full',
  },
  '2xl': {
    1: '2xl:w-full',
    2: '2xl:w-1/2',
    3: '2xl:w-1/3',
    4: '2xl:w-1/4',
    5: '2xl:w-1/5',
    auto: '2xl:w-full',
  },
};

const getResponsiveClasses = (
  gridSize: ResponsiveGridSize,
  type: 'basis' | 'width'
) => {
  const map = type === 'basis' ? basisClasses : widthClasses;

  if (typeof gridSize === 'object' && gridSize !== null) {
    const classes = [];
    if (gridSize.default) classes.push(map.default[gridSize.default]);
    if (gridSize.sm) classes.push(map.sm[gridSize.sm]);
    if (gridSize.md) classes.push(map.md[gridSize.md]);
    if (gridSize.lg) classes.push(map.lg[gridSize.lg]);
    if (gridSize.xl) classes.push(map.xl[gridSize.xl]);
    if (gridSize['2xl']) classes.push(map['2xl'][gridSize['2xl']]);
    return cn(classes);
  }

  return map.default[gridSize];
};

const carouselItemVariants = cva('pl-m');

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
          <CarouselItem
            key={index}
            className={cn(carouselItemVariants(), basisClass)}
          >
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
