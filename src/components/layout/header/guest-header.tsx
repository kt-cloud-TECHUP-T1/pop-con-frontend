import Link from 'next/link';
import { Box } from '@/components/ui/box';
import { Typography } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { HeaderNav } from './header-nav';

export function GuestHeader() {
  return (
    <header className="w-full border-b border-color-[var(--neutral-90)] px-10 pt-6">
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
        <Box className="flex shrink-0 items-center gap-3">
          <Button asChild size="small" variant="ghost">
            <Link href="/login">로그인</Link>
          </Button>
          <Button asChild size="small" variant="primary">
            <Link href="/signup">회원가입</Link>
          </Button>
        </Box>
      </Box>
    </header>
  );
}
