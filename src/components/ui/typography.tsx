// components/ui/typography.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';

// Typography 컴포넌트는 텍스트 표현만 담당해서
// HTML 시맨틱 요소 중 ‘텍스트 의미’가 있는 태그만 as로 허용함

type TypographyVariant =
  | 'display-1'
  | 'display-2'
  | 'heading-1'
  | 'heading-2'
  | 'title-1'
  | 'title-2'
  | 'body-1'
  | 'body-2'
  | 'label-1'
  | 'label-2'
  | 'label-3'
  | 'caption-1'
  | 'caption-2';

type TypographyElement =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'p'
  | 'span'
  | 'div'
  | 'small';

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant: TypographyVariant;
  as?: TypographyElement;
  weight?: 'regular' | 'medium' | 'bold';
  className?: string;
  children: React.ReactNode;
}

const defaultElementMap: Record<TypographyVariant, TypographyElement> = {
  'display-1': 'h1',
  'display-2': 'h2',
  'heading-1': 'h3',
  'heading-2': 'h4',
  'title-1': 'h5',
  'title-2': 'h6',
  'body-1': 'p',
  'body-2': 'p',
  'label-1': 'span',
  'label-2': 'span',
  'label-3': 'span',
  'caption-1': 'small',
  'caption-2': 'small',
};

// variant별 CSS 변수 매핑
const variantStyles: Record<TypographyVariant, React.CSSProperties> = {
  'display-1': {
    fontSize: 'var(--font-size-display-1)',
    lineHeight: 'var(--line-height-display-1)',
    fontWeight: 'var(--font-weight-regular)',
  },
  'display-2': {
    fontSize: 'var(--font-size-display-2)',
    lineHeight: 'var(--line-height-display-2)',
    fontWeight: 'var(--font-weight-regular)',
  },
  'heading-1': {
    fontSize: 'var(--font-size-heading-1)',
    lineHeight: 'var(--line-height-heading-1)',
    fontWeight: 'var(--font-weight-regular)',
  },
  'heading-2': {
    fontSize: 'var(--font-size-heading-2)',
    lineHeight: 'var(--line-height-heading-2)',
    fontWeight: 'var(--font-weight-regular)',
  },
  'title-1': {
    fontSize: 'var(--font-size-title-1)',
    lineHeight: 'var(--line-height-title-1)',
    fontWeight: 'var(--font-weight-regular)',
  },
  'title-2': {
    fontSize: 'var(--font-size-title-2)',
    lineHeight: 'var(--line-height-title-2)',
    fontWeight: 'var(--font-weight-regular)',
  },
  'body-1': {
    fontSize: 'var(--font-size-body-1)',
    lineHeight: 'var(--line-height-body-1)',
    fontWeight: 'var(--font-weight-regular)',
  },
  'body-2': {
    fontSize: 'var(--font-size-body-2)',
    lineHeight: 'var(--line-height-body-2)',
    fontWeight: 'var(--font-weight-regular)',
  },
  'label-1': {
    fontSize: 'var(--font-size-label-1)',
    lineHeight: 'var(--line-height-label-1)',
    fontWeight: 'var(--font-weight-regular)',
  },
  'label-2': {
    fontSize: 'var(--font-size-label-2)',
    lineHeight: 'var(--line-height-label-2)',
    fontWeight: 'var(--font-weight-regular)',
  },
  'label-3': {
    fontSize: 'var(--font-size-label-3)',
    lineHeight: 'var(--line-height-label-3)',
    fontWeight: 'var(--font-weight-regular)',
  },
  'caption-1': {
    fontSize: 'var(--font-size-caption-1)',
    lineHeight: 'var(--line-height-caption-1)',
    fontWeight: 'var(--font-weight-regular)',
  },
  'caption-2': {
    fontSize: 'var(--font-size-caption-2)',
    lineHeight: 'var(--line-height-caption-2)',
    fontWeight: 'var(--font-weight-regular)',
  },
};

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ variant, as, weight, className, style, children, ...props }, ref) => {
    const Component = as || defaultElementMap[variant];

    // variant 스타일 가져오기
    const baseStyle = variantStyles[variant];

    // weight override가 있으면 적용
    const finalStyle: React.CSSProperties = {
      ...baseStyle,
      ...(weight && { fontWeight: `var(--font-weight-${weight})` }),
      ...style,
    };

    return React.createElement(
      Component,
      {
        ref,
        className: cn(className),
        style: finalStyle,
        ...props,
      },
      children
    );
  }
);

Typography.displayName = 'Typography';

export { Typography };
export type { TypographyProps, TypographyVariant };
