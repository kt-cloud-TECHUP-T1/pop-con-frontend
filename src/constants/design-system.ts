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

export const BORDER = {
  NONE: 'border-none',
  SUBTLE: 'border border-[var(--line-3)]',
  DEFAULT: 'border border-[var(--line-4)]',
  STRONG: 'border border-[var(--neutral-30)]',
  STRONG_2: 'border-[2px] border-[var(--neutral-30)]',
} as const;

export const BACKGROUND = {
  TRANSPARENT: 'bg-transparent',
  DEFAULT: 'bg-[var(--bg-default)]',
  STRONG: 'bg-[var(--bg-strong)]',
} as const;

export const PADDING = {
  NONE: 'p-[var(--spacing-none)]',
  _2XS: 'p-[var(--spacing-2xs)]',
  XS: 'p-[var(--spacing-xs)]',
  S: 'p-[var(--spacing-s)]',
  MS: 'p-[var(--spacing-ms)]',
  M: 'p-[var(--spacing-m)]',
  ML: 'p-[var(--spacing-ml)]',
  L: 'p-[var(--spacing-l)]',
  XL: 'p-[var(--spacing-xl)]',
  _2XL: 'p-[var(--spacing-2xl)]',
  _3XL: 'p-[var(--spacing-3xl)]',
} as const;

export const PADDING_X = {
  NONE: 'px-[var(--spacing-none)]',
  _2XS: 'px-[var(--spacing-2xs)]',
  XS: 'px-[var(--spacing-xs)]',
  S: 'px-[var(--spacing-s)]',
  MS: 'px-[var(--spacing-ms)]',
  M: 'px-[var(--spacing-m)]',
  ML: 'px-[var(--spacing-ml)]',
  L: 'px-[var(--spacing-l)]',
  XL: 'px-[var(--spacing-xl)]',
  _2XL: 'px-[var(--spacing-2xl)]',
  _3XL: 'px-[var(--spacing-3xl)]',
} as const;

export const PADDING_Y = {
  NONE: 'py-[var(--spacing-none)]',
  _2XS: 'py-[var(--spacing-2xs)]',
  XS: 'py-[var(--spacing-xs)]',
  S: 'py-[var(--spacing-s)]',
  MS: 'py-[var(--spacing-ms)]',
  M: 'py-[var(--spacing-m)]',
  ML: 'py-[var(--spacing-ml)]',
  L: 'py-[var(--spacing-l)]',
  XL: 'py-[var(--spacing-xl)]',
  _2XL: 'py-[var(--spacing-2xl)]',
  _3XL: 'py-[var(--spacing-3xl)]',
} as const;

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
export type BorderType = keyof typeof BORDER;
export type BackgroundType = keyof typeof BACKGROUND;
export type PaddingType = keyof typeof PADDING;
