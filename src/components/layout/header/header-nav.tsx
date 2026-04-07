'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type Ref, useEffect, useMemo, useState } from 'react';
import { Typography } from '@/components/ui/typography';
import { useTabIndicator } from '@/hooks/use-tab-indicator';
import { HEADER_LINKS } from './types';

export function HeaderNav() {
  const pathname = usePathname();
  const routeActiveLink = useMemo(() => {
    const sorted = [...HEADER_LINKS].sort(
      (a, b) => b.link.length - a.link.length
    );
    return (
      sorted.find((item) =>
        item.link === '/' ? pathname === '/' : pathname.startsWith(item.link)
      )?.link ?? '/'
    );
  }, [pathname]);
  const [uiActiveLink, setUiActiveLink] = useState(routeActiveLink);

  useEffect(() => {
    setUiActiveLink(routeActiveLink);
  }, [routeActiveLink]);

  const { indicator, setContainerRef, setItemRef } =
    useTabIndicator(uiActiveLink);

  return (
    <nav className="min-w-0">
      <ul
        ref={setContainerRef as Ref<HTMLUListElement>}
        className="relative flex gap-6 whitespace-nowrap"
      >
        {HEADER_LINKS.map((item) => {
          const isActive = item.link === uiActiveLink;

          return (
            <li
              key={item.label}
              ref={setItemRef(item.link) as Ref<HTMLLIElement>}
            >
              <Link
                href={item.link}
                onClick={() => {
                  setUiActiveLink(item.link);
                }}
              >
                <Typography
                  variant="title-2"
                  as="span"
                  weight="bold"
                  className={isActive ? 'text-[var(--orange-50)]' : ''}
                >
                  {item.label}
                </Typography>
              </Link>
            </li>
          );
        })}
        <span
          aria-hidden
          className={`pointer-events-none absolute -bottom-7 left-0 h-[3px] rounded-full bg-[var(--orange-50)] ${
            indicator.ready
              ? 'transition-[transform,width] duration-300 ease-out'
              : ''
          }`}
          style={{
            width: indicator.width,
            opacity: indicator.opacity,
            transform: `translateX(${indicator.x}px)`,
          }}
        />
      </ul>
    </nav>
  );
}
