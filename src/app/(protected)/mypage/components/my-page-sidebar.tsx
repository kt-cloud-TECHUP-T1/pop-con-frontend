'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MY_PAGE_SIDEBAR } from '@/app/(protected)/mypage/_config/mypage';
import { cn } from '@/lib/utils';
import type { MyPageSidebarItem } from '@/types/mypage';
import { Typography } from '@/components/ui/typography';

const isActiveSidebarItem = (pathname: string, item: MyPageSidebarItem) => {
  if (item.match === 'exact') {
    return pathname === item.href;
  }

  return pathname.startsWith(item.href);
};

export function MyPageSidebar() {
  const pathname = usePathname();

  return (
    <nav aria-label="마이페이지 사이드바">
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
                      className={cn(
                        'transition-colors',
                        isActive
                          ? 'text-[var(--neutral-10)]'
                          : 'text-[var(--neutral-60)]'
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  );
}
