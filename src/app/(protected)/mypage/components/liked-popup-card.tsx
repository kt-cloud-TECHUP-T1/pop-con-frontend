'use client';

import { CardThumbnail } from '@/components/content/card-thumbnail';

type LikedPopupCardProps = {
  title: string;
  description: string;
  caption: string;
  thumbnailUrl: string;
  isLiked?: boolean;
  onClickLike?: () => void;
};

export function LikedPopupCard({
  title,
  description,
  caption,
  thumbnailUrl,
  isLiked = true,
  onClickLike,
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
      showButtonLike={Boolean(onClickLike)}
      showCountView
      showCountLike
    />
  );
}
