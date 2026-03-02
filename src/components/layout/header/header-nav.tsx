'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Typography } from '@/components/ui/typography';
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

  const navListRef = useRef<HTMLUListElement | null>(null);
  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const mountedRef = useRef(false);
  const [indicator, setIndicator] = useState({
    x: 0,
    width: 0,
    opacity: 0,
    ready: false,
  });

  useLayoutEffect(() => {
    const updateIndicator = () => {
      const navEl = navListRef.current;
      const activeEl = itemRefs.current[uiActiveLink];
      if (!navEl || !activeEl) return;

      const navRect = navEl.getBoundingClientRect();
      const itemRect = activeEl.getBoundingClientRect();

      setIndicator((prev) => ({
        x: itemRect.left - navRect.left,
        width: itemRect.width,
        opacity: 1,
        ready: mountedRef.current ? prev.ready || true : false,
      }));
    };

    updateIndicator();
    window.addEventListener('resize', updateIndicator);

    if (!mountedRef.current) {
      mountedRef.current = true;
      requestAnimationFrame(() => {
        setIndicator((prev) => ({ ...prev, ready: true }));
      });
    }

    return () => window.removeEventListener('resize', updateIndicator);
  }, [uiActiveLink]);

  return (
    <nav className="min-w-0">
      <ul ref={navListRef} className="relative flex gap-6 whitespace-nowrap">
        {HEADER_LINKS.map((item) => {
          const isActive = item.link === uiActiveLink;

          return (
            <li
              key={item.label}
              ref={(el) => {
                itemRefs.current[item.link] = el;
              }}
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
          className={`pointer-events-none absolute -bottom-8.5 left-0 h-[3px] rounded-full bg-[var(--orange-50)] ${
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
