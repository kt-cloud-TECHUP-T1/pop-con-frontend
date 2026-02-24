// NOTE: Box 컴포넌트는 의미 없는 레이아웃입니다

import {
  RADIUS,
  RadiusType,
  SHADOW,
  ShadowType,
} from '@/constants/design-system';
import { cn } from '@/lib/utils';

type BoxProps = React.HTMLAttributes<HTMLElement> & {
  as?: React.ElementType;
  radius?: RadiusType;
  shadow?: ShadowType;
};

export const Box = ({
  as: Comp = 'div',
  radius = 'NONE',
  shadow,
  className,
  ...props
}: BoxProps) => {
  return (
    <Comp
      className={cn(
        // TODO: spacing, border, background 정도가 추가 되지 않을까
        radius && RADIUS[radius],
        shadow && SHADOW[shadow],
        className
      )}
      {...props}
    />
  );
};
