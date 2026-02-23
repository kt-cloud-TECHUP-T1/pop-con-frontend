// client component

'use client';

import { cn } from '@/lib/utils';
import { Avatar, AvatarProps } from './CommonAvatar';
import { Icon } from '@/components/Icon/Icon';

interface AvatarEditableProps extends Omit<AvatarProps, 'className'> {
  onEdit: () => void;
  editButtonClassName?: string;
}

export const AvatarEditable = ({
  onEdit,
  ...avatarProps
}: AvatarEditableProps) => {
  return (
    <div className="relative inline-block">
      <Avatar {...avatarProps} />
      <button
        onClick={onEdit}
        className={cn(
          'absolute bottom-0 right-0 w-7 h-7 bg-black rounded-full',
          'flex items-center justify-center border-2 border-white cursor-pointer'
        )}
      >
        <Icon name="Pencil" className="text-white" size={16} />
      </button>
    </div>
  );
};
