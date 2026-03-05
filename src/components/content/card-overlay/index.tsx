'use client';

import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const thumbnailVariants = cva('w-full object-cover', {
  variants: {
    ratio: {
      '3/4': 'aspect-[384/501]',
      '16/9': 'aspect-video',
    },
  },
  defaultVariants: {
    ratio: '3/4',
  },
});

export interface CardOverlayProps {
  thumbnailUrl: string;
  thumbnailAlt?: string;
  thumbnailRatio?: '3/4' | '16/9';
  title?: string;
  description?: string;
  caption?: string;
  onClick?: () => void;
}

export const CardOverlay: React.FC<CardOverlayProps> = ({
  thumbnailUrl,
  thumbnailAlt = '',
  thumbnailRatio = '3/4',
  title,
  description,
  caption,
  onClick,
}) => {
  return (
    <div
      className={cn(
        'card-overlay',
        'relative rounded-ml border border-Line-Line-3/10 overflow-hidden',
        onClick && 'cursor-pointer'
      )}
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
      <img
        className={cn(
          'thumbnail',
          thumbnailVariants({ ratio: thumbnailRatio })
        )}
        src={thumbnailUrl}
        alt={thumbnailAlt || title || ''}
      />

      <div
        className={cn(
          'info',
          'flex flex-col justify-end items-start gap-2',
          'px-8 pt-12 pb-6',
          'absolute bottom-0 left-0 w-full',
          'bg-linear-to-b from-white/0 via-neutral-900/20 to-black/50',
          'text-white'
        )}
      >
        <div className="flex flex-col justify-start items-start gap-1">
          <h6
            className={cn(
              'title',
              'self-stretch justify-start text-Common-White text-3xl font-bold leading-10 line-clamp-2'
            )}
          >
            {title}
          </h6>
          {description && (
            <div className="justify-start text-Common-White text-lg font-normal leading-6">
              {description}
            </div>
          )}
          {caption && (
            <div className="justify-start text-Common-White text-sm font-normal leading-5">
              {caption}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
