import Link from 'next/link';
import Image from 'next/image';
import { cookies } from 'next/headers';
import { Box } from '@/components/ui/box';
import { HeaderNav } from './header-nav';
import { Avatar } from '@/components/ui/avatar';
import { Icon } from '@/components/Icon/Icon';

export async function Header() {
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get('refresh_token');

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
          <HeaderNav />
        </Box>
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
          {/* TODO: 알림 기능 확정 전까지 아이콘만 노출 */}
          <Icon name="Bell" size={24} className="text-[var(--neutral-20)]" />

          <Link
            // 마이페이지 테스트 후 주석 제거
            // href={isLoggedIn ? '/mypage' : '/login'}
            href="/mypage"
            aria-label="마이페이지"
          >
            <Avatar
              className="bg-[var(--neutral-90)]"
              icon={{ name: 'PersonFill', className: 'text-white', size: 16 }}
            ></Avatar>
          </Link>
        </Box>
      </Box>
    </header>
  );
}
