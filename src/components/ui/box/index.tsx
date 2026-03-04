// NOTE: Box 컴포넌트는 의미 없는 레이아웃입니다

import type { ComponentPropsWithoutRef, CSSProperties, ElementType } from 'react';
import {
  BACKGROUND,
  BackgroundType,
  BORDER,
  BorderType,
  PADDING,
  PADDING_X,
  PADDING_Y,
  PaddingType,
  RADIUS,
  RadiusType,
  SHADOW,
  ShadowType,
} from '@/constants/design-system';
import { cn } from '@/lib/utils';

type BoxOwnProps = {
  radius?: RadiusType;
  shadow?: ShadowType;
  border?: BorderType | string;
  background?: BackgroundType | string;
  padding?: PaddingType;
  paddingX?: PaddingType;
  paddingY?: PaddingType;
};

type BoxProps<T extends ElementType = 'div'> = BoxOwnProps & {
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, keyof BoxOwnProps | 'as'>;

export const Box = <T extends ElementType = 'div'>({
  as,
  radius = 'NONE',
  shadow,
  border = 'NONE',
  background = 'TRANSPARENT',
  padding,
  paddingX,
  paddingY,
  className,
  style,
  ...props
}: BoxProps<T>) => {
  const Comp = as ?? 'div';
  const isButton = Comp === 'button';
  const isBorderToken = typeof border === 'string' && border in BORDER;
  const isBackgroundToken =
    typeof background === 'string' && background in BACKGROUND;
  const boxStyle: CSSProperties | undefined = {
    ...(border && !isBorderToken
      ? {
          borderColor: border,
          borderStyle: 'solid',
          borderWidth: '1px',
        }
      : undefined),
    ...(background && !isBackgroundToken
      ? {
          backgroundColor: background,
        }
      : undefined),
    ...style,
  };

  return (
    <Comp
      className={cn(
        isButton && 'cursor-pointer',
        radius && RADIUS[radius],
        shadow && SHADOW[shadow],
        isBorderToken ? BORDER[border as BorderType] : border && 'border',
        isBackgroundToken
          ? BACKGROUND[background as BackgroundType]
          : undefined,
        padding && PADDING[padding],
        paddingX && PADDING_X[paddingX],
        paddingY && PADDING_Y[paddingY],
        className
      )}
      style={boxStyle}
      {...props}
    />
  );
};
