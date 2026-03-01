'use client';

import Link from 'next/link';
import { Box } from '../ui/box';
import { Typography } from '../ui/typography';
import { Input } from '../ui/input';
import { Icon } from '../Icon/Icon';
import { usePathname } from 'next/navigation';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

type HeaderLink = {
  label: string;
  link: string;
};

const HEADER_LINK: HeaderLink[] = [
  { label: '홈', link: '/' },
  { label: '더치 경매', link: '/auction' },
  { label: '드로우', link: '/draw' },
  { label: '발견', link: '/discover' },
  { label: '매거진', link: '/magazine' },
];

export const Header = () => {
  const pathname = usePathname();
  const routeActiveLink = useMemo(() => {
    const sorted = [...HEADER_LINK].sort(
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
    <header className="w-full px-10 pt-6 border-b border-color-[var(--neutral-90)]">
      {/* 비회원일 때 */}
      <Box className="max-w-[1280px] mx-auto px-10">
        <Link
          href="/"
          className="w-full max-w-[130px] py-1 bg-[var(--neutral-90)] text-center inline-block"
        >
          <Typography variant="caption-1" weight="bold">
            Logo
          </Typography>
        </Link>
      </Box>
      {/* 회원일 때 */}
      <Box className="max-w-[1280px] mx-auto flex items-center justify-between gap-8 px-10">
        <Box className="min-w-0 flex flex-1 items-center gap-12">
          <Link
            href="/"
            className="w-full max-w-[130px] shrink-0 py-1 bg-[var(--neutral-90)] text-center inline-block"
          >
            <Typography variant="caption-1" weight="bold">
              Logo
            </Typography>
          </Link>
          <nav className="min-w-0">
            <ul
              ref={navListRef}
              className="relative flex gap-6 pb-6 whitespace-nowrap pb-2"
            >
              {HEADER_LINK.map((item) => {
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
                className={`pointer-events-none absolute -bottom-0.5 left-0 h-[3px] rounded-full bg-[var(--orange-50)] ${
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
        </Box>
        <Box className="flex shrink-0 items-center gap-6">
          {/* TODO 나중에 인풋 안에 돋보기 아이콘 보이도록 하기 */}
          <Input
            className="w-[320px] border border-[var(--orange-50)]"
            suffix="Search"
            placeholder="Search..."
          />
          <Link href="/mypage">
            <Icon name="Person" />
          </Link>
        </Box>
      </Box>
    </header>
  );
};
