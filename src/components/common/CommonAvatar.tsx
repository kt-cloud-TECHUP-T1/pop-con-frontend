// server component

import { AVATAR_SIZE, type AvatarSizeType } from '@/constants/design-system';
import { Icon, IconProps } from '@/components/Icon/Icon';
import Image from 'next/image';

export interface AvatarProps {
  src?: string; // 이미지 URL
  alt?: string;
  size?: AvatarSizeType;
  className?: string;
  icon?: Pick<IconProps, 'name' | 'color' | 'size'>;
}

export const Avatar = ({
  src,
  alt = 'Avatar',
  size = 'MD',
  className = '',
  icon = { name: 'PersonFill' },
}: AvatarProps) => {
  return (
    <div
      className={`${AVATAR_SIZE[size]} ${className} rounded-full overflow-hidden flex items-center justify-center relative bg-gray-200`}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="w-full h-full object-cover"
        />
      ) : (
        <Icon name={icon.name} color={icon.color} size={icon.size} />
      )}
    </div>
  );
};
