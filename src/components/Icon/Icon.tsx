import React from 'react';
import * as BaseIcons from './icons';
import * as UiIcons from './ui-icons';

const Icons = {
  ...BaseIcons,
  ...UiIcons,
};

// 자동완성을 위한 타입
export type IconName = keyof typeof Icons;

export interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  onClick?: () => void;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  className,
  onClick,
}) => {
  const IconComponent = Icons[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return (
    <IconComponent
      width={size}
      height={size}
      className={className}
      onClick={onClick}
    />
  );
};
