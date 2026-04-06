import Link from 'next/link';
import { Box } from '@/components/ui/box';
import { Typography } from '@/components/ui/typography';
import { HeaderNav } from './header-nav';
import { Avatar } from '@/components/ui/avatar';
import { Icon } from '@/components/Icon/Icon';

export function MemberHeader() {
  return (
    <header className="w-full border-b border-[var(--neutral-90)] py-5">
      <Box className="mx-auto flex max-w-[1280px] items-center justify-between gap-8 px-10">
        <Box className="min-w-0 flex flex-1 items-start gap-12">
          <Link
            href="/"
            className="inline-block w-full max-w-[130px] shrink-0 bg-[var(--neutral-90)] py-1 text-center"
          >
            <Typography variant="caption-1" weight="bold">
              Logo
            </Typography>
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

          <Link href="/mypage" aria-label="마이페이지">
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
