export type HeaderVariant = 'guest' | 'member';

export type HeaderLink = {
  label: string;
  link: string;
};

export const HEADER_LINKS: HeaderLink[] = [
  { label: '홈', link: '/' },
  // TODO 경매 페이지 라우팅 구현
  { label: '더치 경매', link: '/auction/1' },
  { label: '드로우', link: '/draw' },
  { label: '발견', link: '/discover' },
  { label: '매거진', link: '/magazine' },
];
