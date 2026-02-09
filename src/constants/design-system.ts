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
