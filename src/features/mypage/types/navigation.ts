export type MyPageSidebarItem = {
  label: string;
  href: string;
  match?: 'exact' | 'prefix';
};

export type MyPageSidebarSection = {
  title: string;
  items: MyPageSidebarItem[];
};

export type ActivityTabValue =
  | 'tickets'
  | 'bids'
  | 'draws'
  | 'reviews';

export type ActivityTabItem = {
  label: string;
  value: ActivityTabValue;
};
