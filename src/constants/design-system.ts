// globals.css에도 등록을 해줘야 함
export const RADIUS = {
  NONE: 'rounded-shape-none', // 0
  XXS: 'rounded-2xs', // 4px;
  XS: 'rounded-xs', // 6px
  S: 'rounded-s', // 8px
  MS: 'rounded-ms', // 10px
  M: 'rounded-m', // 12px
  ML: 'rounded-ml', // 16px
  LG: 'rounded-lg', // 20px
  XL: 'rounded-xl', // 24px
  _2XL: 'rounded-2xl', // 32px
  _3XL: 'rounded-3xl', // 48px
  FULL: 'rounded-shape-full', // 1000px
} as const;

export const SHADOW = {
  S: 'shadow-elevation-s',
  M: 'shadow-elevation-m',
  L: 'shadow-elevation-l',
  XL: 'shadow-elevation-xl',
};

export const AVATAR_SIZE = {
  XS: 'size-avatar-xs', // 20x20
  SM: 'size-avatar-sm', // 24x24
  MD: 'size-avatar-md', // 32x32
  LG: 'size-avatar-lg', // 40x40
  XL: 'size-avatar-xl', // 48x48
  _2XL: 'size-avatar-2xl', // 72x72
  _3XL: 'size-avatar-3xl', // 88x88
};

export type ShadowType = keyof typeof SHADOW;
export type AvatarSizeType = keyof typeof AVATAR_SIZE;
export type RadiusType = keyof typeof RADIUS;
