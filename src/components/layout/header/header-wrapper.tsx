'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Box } from '@/components/ui/box';
import { HeaderNav } from './header-nav';
import { Avatar } from '@/components/ui/avatar';
import { Icon } from '@/components/Icon/Icon';
import { useAuthStore } from '@/features/auth/stores/auth-store';

const AUTH_PATHS = ['/login', '/signup', '/verify', '/callback'];

export function HeaderWrapper({
  isLoggedIn: serverIsLoggedIn,
}: {
  isLoggedIn: boolean;
}) {
  const pathname = usePathname();
  const authStatus = useAuthStore((state) => state.authStatus);

  const isLoggedIn =
    authStatus === 'loading'
      ? serverIsLoggedIn
      : authStatus === 'authenticated';

  const isAuthPage = AUTH_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  return (
    <header className="w-full border-b border-[var(--neutral-90)] py-5 sticky top-0 bg-white z-50">
      <Box className="mx-auto flex max-w-[1280px] items-center justify-between gap-8 px-10">
        <Box className="min-w-0 flex flex-1 items-center gap-12">
          <Link
            href="/"
            className="inline-block text-center"
            aria-label="POP-CON 홈"
          >
            <Image src="/Logo.svg" alt="" width={70} height={40} />
          </Link>

          {/* 인증 페이지가 아닐 때만 네비게이션 노출 */}
          {!isAuthPage && <HeaderNav />}
        </Box>

        {/* 인증 페이지가 아닐 때만 우측 영역 노출 */}
        {!isAuthPage && (
          <Box className="flex shrink-0 items-center gap-4">
            <label className="relative block w-[360px]">
              <Icon
                name="Search"
                size={20}
                className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[#737373]"
              />
              <Box
                as="input"
                border="var(--orange-50)"
                radius="MS"
                background="white"
                paddingY="XS"
                paddingX="S"
                className="w-full pl-10 text-[15px] outline-none placeholder:text-[#9f9f9f]"
                placeholder="Placeholder"
                aria-label="검색"
              />
            </label>

            {isLoggedIn ? (
              <>
                {/* 회원: 알림 아이콘 + Avatar */}
                <Icon
                  name="Bell"
                  size={24}
                  className="text-[var(--neutral-20)]"
                />
                <Link href="/mypage" aria-label="마이페이지">
                  <Avatar
                    className="bg-[var(--neutral-90)]"
                    icon={{
                      name: 'PersonFill',
                      className: 'text-white',
                      size: 16,
                    }}
                  />
                </Link>
              </>
            ) : (
              /* 비회원: 유저 아이콘 → 클릭 시 로그인 이동 */
              <Link href="/login" aria-label="로그인">
                <Icon
                  name="Person"
                  size={24}
                  className="text-[var(--neutral-20)]"
                />
              </Link>
            )}
          </Box>
        )}
      </Box>
    </header>
  );
}
