'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MY_PAGE_SIDEBAR } from '@/app/(protected)/mypage/_config/mypage';
import { cn } from '@/lib/utils';
import type { MyPageSidebarItem } from '@/features/mypage/types/navigation';
import { Typography } from '@/components/ui/typography';
import { Box } from '@/components/ui/box';

const isActiveSidebarItem = (pathname: string, item: MyPageSidebarItem) => {
  if (item.match === 'exact') {
    return pathname === item.href;
  }

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
