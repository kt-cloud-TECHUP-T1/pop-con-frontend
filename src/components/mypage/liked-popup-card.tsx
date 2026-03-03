import { CardThumbnail } from '@/components/content/card-thumbnail';

type LikedPopupCardProps = {
  title: string;
  description: string;
  caption: string;
  thumbnailUrl: string;
};

export function LikedPopupCard({
  title,
  description,
  caption,
  thumbnailUrl,
}: LikedPopupCardProps) {
  return (
    <CardThumbnail
      thumbnailUrl={thumbnailUrl}
      thumbnailRatio="3/4"
      title={title}
      description={description}
      caption={caption}
      showButtonLike
      isLiked
    />
  );
}
