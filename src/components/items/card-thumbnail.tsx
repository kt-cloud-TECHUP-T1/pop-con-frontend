'use client'

import { cn } from "@/lib/utils";
import { Icon } from "../Icon/Icon";

export interface CardThumbnailProps {
  thumbnailUrl: string;
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
  onClickLike?: () => void;
  onClick?: () => void;
}

export const CardThumbnail: React.FC<CardThumbnailProps> = ({
  thumbnailUrl,
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
  onClickLike,
  onClick,
}) => {

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClickLike?.();
  }

  return (
    <div className="card-thumbnail" onClick={onClick}>
      <div className="self-stretch inline-flex flex-col justify-start items-start gap-4">
        <div className={cn(
          'thumbnail',
          "self-stretch relative flex flex-col justify-start items-start gap-4 "
        )}>
          <img className="self-stretch h-96 relative rounded-ml border border-Line-Line-3/10 aspect-3/4 object-cover" src={thumbnailUrl} />
          {showButtonLike &&

            <button className={cn(
              'button-like',
              'right-4 top-4 absolute text-white'
            )}
              onClick={handleLike}
            >
              <Icon name={isLiked ? "HeartFill" : "Heart"} size={32} />
            </button>
          }
        </div>
        <div className={cn(
          'info',
          'self-stretch px-1 flex flex-col justify-start items-start gap-2'
        )}>
          <div className="flex flex-col justify-start items-start gap-1 text-neutral-800">
            {label &&
              <div className="px-4 py-1 bg-orange-500 text-white rounded-md inline-flex justify-center items-center">
                <div className="justify-start text-Common-White text-sm font-bold font-['Pretendard'] leading-5">{label}</div>
              </div>
            }
            <div className={cn(
              "title",
              "justify-start text-Contents-High text-lg font-bold font-['Pretendard'] leading-6"
            )}>{title}</div>
            {description &&
              <div className="justify-start text-Contents-High text-base font-normal font-['Pretendard'] leading-6">{description}</div>
            }
            {caption &&
              <div className="justify-start text-Contents-Extra-Low text-xs font-normal font-['Pretendard'] leading-5 text-neutral-60">{caption}</div>
            }
            <div className="inline-flex justify-start items-center gap-2 text-neutral-500">
              {showCountView && <div className="flex justify-start items-center gap-0.5">
                <Icon name="Eyes" size={16} />
                <div className="justify-start text-Contents-Extra-Low text-xs font-normal font-['Pretendard'] leading-4">{countView || 0}</div>
              </div>}
              {showCountLike && <div className="flex justify-start items-center gap-0.5">
                <Icon name="Heart" size={16} />
                <div className="justify-start text-Contents-Extra-Low text-xs font-normal font-['Pretendard'] leading-4">{countLike || 0}</div>
              </div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}