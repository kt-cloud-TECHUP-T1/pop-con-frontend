import Image from 'next/image';
import type { BorderType, RadiusType } from '@/constants/design-system';
import { Box } from '@/components/ui/box';
import { cn } from '@/lib/utils';

type ThumbnailImageProps = {
  src?: string;
  alt?: string;
  width: number;
  height: number;
  radius?: RadiusType;
  border?: BorderType | string;
  className?: string;
  imageClassName?: string;
  fallbackSrc?: string;
};

export function ThumbnailImage({
  src,
  alt = '',
  width,
  height,
  radius = 'S',
  border = 'NONE',
  className,
  imageClassName,
  fallbackSrc = '/images/temp/no-image.png',
}: ThumbnailImageProps) {
  const imageSrc = src?.trim() ? src : fallbackSrc;

  return (
    <Box
      radius={radius}
      border={border}
      className={cn('relative overflow-hidden', className)}
      style={{ width, height }}
    >
      <Image
        src={imageSrc}
        fill
        sizes={`${width}px`}
        className={cn('object-cover', imageClassName)}
        alt={alt}
      />
    </Box>
  );
}
