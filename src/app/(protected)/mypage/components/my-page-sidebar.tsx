'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Typography } from '@/components/ui/typography';
import { Box } from '@/components/ui/box';

type MyPageSidebarItem = {
  label: string;
  href: string;
};

type MyPageSidebarSection = {
  title: string;
  items: MyPageSidebarItem[];
};

const MY_PAGE_SIDEBAR: MyPageSidebarSection[] = [
  {
    title: '내 정보',
    items: [
      {
        label: '프로필 관리',
        href: '/mypage/info/profile',
      },
      {
        label: '결제수단 관리',
        href: '/mypage/info/payment-methods',
      },
    ],
  },
  {
    title: '활동',
    items: [
      {
        label: '내 티켓',
        href: '/mypage/info/tickets',
      },
      {
        label: '드로우 내역',
        href: '/mypage/activity/draws',
      },
      { label: '낙찰 내역', href: '/mypage/activity/bids' },
      {
        label: '작성한 리뷰',
        href: '/mypage/activity/reviews',
      },
      {
        label: '찜 목록',
        href: '/mypage/activity/liked-popups',
      },
    ],
  },
  {
    title: '기타',
    items: [
      { label: '설정', href: '/mypage/others/settings' },
      {
        label: '고객센터',
        href: '/support',
      },
    ],
  },
];

const isActiveSidebarItem = (pathname: string, item: MyPageSidebarItem) => {
  return pathname.startsWith(item.href);
};

export function MyPageSidebar() {
  const pathname = usePathname();

  return (
    <Box
      as="nav"
      padding="M"
      radius="ML"
      border="--neutral-90"
      aria-label="마이페이지 사이드바"
      className="max-w-[180px]"
    >
      <Typography variant="title-1" weight="medium" className="mb-4">
        My 팝콘
      </Typography>
      <ul className="space-y-8">
        {MY_PAGE_SIDEBAR.map((section) => (
          <li key={section.title}>
            <Typography variant="body-1" weight="bold" className="mb-2">
              {section.title}
            </Typography>
            <ul className="space-y-2">
              {section.items.map((item) => {
                const isActive = isActiveSidebarItem(pathname, item);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <Typography
                        variant="label-2"
                        weight={isActive ? 'bold' : 'regular'}
                        className={cn(
                          'transition-colors',
                          isActive
                            ? 'text-[var(--orange-50)]'
                            : 'text-[var(--neutral-60)]'
                        )}
                      >
                        {item.label}
                      </Typography>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ul>
    </Box>
  );
}
