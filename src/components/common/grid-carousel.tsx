import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselOptions,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';

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
}

export const GridCarousel: React.FC<GridCarouselProps> = ({
  gridSize = 4,
  items,
  carouselOpts,
  showArrows = true,
}) => {
  return (
    <Carousel className="w-full" opts={carouselOpts}>
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
        <div className="container absolute h-full top-0 left-1/2 -translate-x-1/2 pointer-events-none z-10">
          <CarouselPrevious className="size-12 min-w-auto min-h-auto outline-1 -outline-offset-1 inline-flex justify-center items-center gap-2 overflow-hidden shadow-[0px_2px_8px_0px_rgba(0,0,0,0.12)] -left-6 bg-white pointer-events-auto" />
          <CarouselNext className="size-12 min-w-auto min-h-auto outline-1 -outline-offset-1 inline-flex justify-center items-center gap-2 overflow-hidden shadow-[0px_2px_8px_0px_rgba(0,0,0,0.12)] -right-6 bg-white pointer-events-auto" />
        </div>
      )}
    </Carousel>
  );
};
