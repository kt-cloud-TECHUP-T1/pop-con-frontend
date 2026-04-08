'use client';

import { cn } from '@/lib/utils';
import { Icon } from '@/components/Icon/Icon';

import { cva, type VariantProps } from 'class-variance-authority';
import { Box } from '@/components/ui/box';
import { Typography } from '@/components/ui/typography';

const thumbnailVariants = cva(
  'w-full rounded-ml border border-Line-Line-3/10 object-cover',
  {
    variants: {
      ratio: {
        '1/1': 'aspect-square',
        '3/4': 'aspect-[3/4]',
        '16/9': 'aspect-video',
      },
    },
    defaultVariants: {
      ratio: '3/4',
    },
  }
);

export interface CardThumbnailProps {
  thumbnailUrl?: string;
  thumbnailAlt?: string;
  thumbnailRatio?: '1/1' | '3/4' | '16/9';
  title?: string;
  label?: string;
  description?: string;
  caption?: string;
  countView?: number;
  countLike?: number;
  index?: number;
  showButtonLike?: boolean;
  showCountView?: boolean;
  showCountLike?: boolean;
  isLiked?: boolean;
  thumbnailClassName?: string;
  overlayBadge?: React.ReactNode;
  overlayBadgeBackground?: string;
  overlayBadgeClassName?: string;
  onClickLike?: () => void;
  onClick?: () => void;
}

export const CardThumbnail: React.FC<CardThumbnailProps> = ({
  thumbnailUrl,
  thumbnailAlt = '',
  thumbnailRatio = '1/1',
  title,
  label,
  description,
  caption,
  countView,
  countLike,
  showButtonLike,
  showCountView,
  showCountLike,
  index,
  isLiked,
  thumbnailClassName,
  overlayBadge,
  overlayBadgeBackground,
  overlayBadgeClassName,
  onClickLike,
  onClick,
}) => {
  const isLikeInteractive = Boolean(onClickLike);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClickLike?.();
  };

  return (
    <div
      className={cn('card-thumbnail', onClick && 'cursor-pointer')}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      <div className="self-stretch flex flex-col justify-start items-start gap-4">
        <div
          className={cn(
            'wrapper-thumbnail',
            'self-stretch relative flex flex-col justify-start items-start gap-4'
          )}
        >
          <img
            className={cn(
              'thumbnail',
              thumbnailVariants({ ratio: thumbnailRatio }),
              thumbnailClassName
            )}
            src={thumbnailUrl ?? '/images/temp/no-image.png'}
            alt={thumbnailAlt || title || ''}
          />
          {showButtonLike && (
            <button
              type="button"
              aria-pressed={isLiked}
              aria-disabled={!isLikeInteractive}
              disabled={!isLikeInteractive}
              className={cn(
                'button-like',
                'right-0 top-0 p-4 absolute text-white',
                isLikeInteractive
                  ? 'cursor-pointer'
                  : 'cursor-default opacity-70'
              )}
              onClick={handleLike}
            >
              <Icon name={isLiked ? 'HeartFill' : 'Heart'} size={32} />
            </button>
          )}
          {index && (
            <div className="w-10 h-10 p-2.5 bg-orange-500 rounded-ms inline-flex flex-col justify-center items-center text-white text-2xl font-bold absolute bottom-4 left-4">
              {index}
            </div>
          )}
          {overlayBadge && (
            <Box
              className={cn('overflow-hidden', overlayBadgeClassName)}
              paddingY="_2XS"
              paddingX="S"
              radius="S"
              background={overlayBadgeBackground}
            >
              {overlayBadge}
            </Box>
          )}
        </div>
        <div
          className={cn(
            'info',
            'self-stretch px-1 flex flex-col justify-start items-start gap-2'
          )}
        >
          <div className="flex flex-col justify-start items-start gap-1 text-neutral-800">
            {label && (
              <div className="px-4 py-1 bg-orange-500 text-white rounded-md inline-flex justify-center items-center">
                <div className="justify-start text-Common-White text-sm font-bold leading-5">
                  {label}
                </div>
              </div>
            )}
            <Typography
              variant="title-2"
              weight="bold"
              className={cn(
                'title',
                'justify-start text-Contents-High text-lg leading-6'
              )}
            >
              {title}
            </Typography>
            {description && (
              <Typography
                variant="body-1"
                weight="regular"
                className="justify-start text-base leading-6 text-[var(--content-high)]"
              >
                {description}
              </Typography>
            )}
            {caption && (
              <Typography
                variant="caption-1"
                className="justify-start text-xs font-normal leading-5 text-[var(--content-extra-low)]"
              >
                {caption}
              </Typography>
            )}
            <div className="inline-flex justify-start items-center gap-2 text-neutral-500">
              {showCountView && (
                <div className="flex justify-start items-center gap-0.5">
                  <Icon name="Eyes" size={16} />
                  <div className="justify-start text-Contents-Extra-Low text-xs font-normal leading-4">
                    {countView || 0}
                  </div>
                </div>
              )}
              {showCountLike && (
                <div className="flex justify-start items-center gap-0.5">
                  <Icon name="Heart" size={16} />
                  <div className="justify-start text-Contents-Extra-Low text-xs font-normal leading-4">
                    {countLike || 0}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
