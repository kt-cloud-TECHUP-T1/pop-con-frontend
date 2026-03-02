import Link from 'next/link';
import { Box } from '@/components/ui/box';
import { Typography } from '@/components/ui/typography';
import { Input } from '@/components/ui/input';
import { HeaderNav } from './header-nav';
import { Avatar } from '@/components/ui/avatar';

export function MemberHeader() {
  return (
    <header className="w-full border-b border-[var(--neutral-90)] py-6">
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
        <Box className="flex shrink-0 items-center gap-6">
          <Input
            className="w-[320px] border border-[var(--orange-50)]"
            suffix="Search"
            inputSize="small"
            placeholder="Search..."
            aria-label="검색"
          />
          <Link href="/mypage" aria-label="마이페이지">
            <Avatar
              icon={{ name: 'PersonFill', className: 'text-white', size: 18 }}
            ></Avatar>
          </Link>
        </Box>
      </Box>
    </header>
  );
}
