import Image from 'next/image';
import { cn } from '@/lib/utils';

type ThumbnailSize = 'sm' | 'md' | 'lg';

const sizeClass: Record<ThumbnailSize, string> = {
  sm: 'rounded-m',
  md: 'rounded-ml',
  lg: 'rounded-lg',
};

interface ThumbnailProps {
  src?: string;
  alt?: string;
  size?: ThumbnailSize;
  className?: string;
  priority?: boolean;
}

export function SaleThumbnail({
  src,
  alt = '',
  size = 'md',
  className,
  priority,
}: ThumbnailProps) {
  return (
    <div
      className={cn(
        'relative w-full overflow-hidden bg-gray-100 aspect-[135/76]',
        sizeClass[size],
        className
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 640px, 100vw"
          //리사이징 옵션 꺼야할 경우 대비
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-gray-400">
          No Image
        </div>
      )}
    </div>
  );
}
