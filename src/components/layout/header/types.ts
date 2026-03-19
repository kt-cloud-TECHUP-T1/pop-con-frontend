export type HeaderVariant = 'guest' | 'member';

export type HeaderLink = {
  label: string;
  link: string;
};

export const HEADER_LINKS: HeaderLink[] = [
  { label: '홈', link: '/' },
  // 페이지 이동을 위해 임시로 설정해둠
  { label: '더치 경매', link: '/auction/1' },
  { label: '드로우', link: '/draw' },
  { label: '발견', link: '/discover' },
  { label: '매거진', link: '/magazine' },
];
