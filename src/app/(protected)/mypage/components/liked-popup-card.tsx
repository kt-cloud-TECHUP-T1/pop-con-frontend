'use client';

import { CardThumbnail } from '@/components/content/card-thumbnail';

type LikedPopupCardProps = {
  title: string;
  description: string;
  caption: string;
  thumbnailUrl: string;
  countLike: number;
  countView: number;
  isLiked?: boolean;
  onClickLike?: () => void;
  onClick?: () => void;
};

export function LikedPopupCard({
  title,
  description,
  caption,
  thumbnailUrl,
  isLiked = true,
  onClickLike,
  onClick,
  countLike,
  countView,
}: LikedPopupCardProps) {
  return (
    <CardThumbnail
      thumbnailUrl={thumbnailUrl}
      thumbnailRatio="3/4"
      isLiked={isLiked}
      onClickLike={onClickLike}
      title={title}
      description={description}
      caption={caption}
      showButtonLike
      countLike={countLike}
      countView={countView}
      showCountLike
      showCountView
      onClick={onClick}
    />
  );
}
