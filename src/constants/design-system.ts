// globals.css에도 등록을 해줘야 함
export const RADIUS = {
  NONE: 'rounded-shape-none',
  XXS: 'rounded-2xs',
  XS: 'rounded-xs',
  S: 'rounded-s',
  MS: 'rounded-ms',
  M: 'rounded-m',
  ML: 'rounded-ml',
  LG: 'rounded-lg',
  XL: 'rounded-xl',
  FULL: 'rounded-shape-full',
} as const;

export type RadiusType = keyof typeof RADIUS;

//_3XS 등 식별자규칙 적용
export const SPACING = {
  NONE: 'var(--spacing-none)',

  _3XS: 'var(--spacing-3xs)',
  _2XS: 'var(--spacing-2xs)',
  XS: 'var(--spacing-xs)',
  S: 'var(--spacing-s)',
  MS: 'var(--spacing-ms)',
  M: 'var(--spacing-m)',
  ML: 'var(--spacing-ml)',
  L: 'var(--spacing-l)',
  XL: 'var(--spacing-xl)',
  _2XL: 'var(--spacing-2xl)',
  _3XL: 'var(--spacing-3xl)',

  PAGE: 'var(--spacing-page)',
} as const;

export type SpacingType = keyof typeof SPACING;
