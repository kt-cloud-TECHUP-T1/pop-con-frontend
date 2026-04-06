import Link from 'next/link';
import Image from 'next/image';
import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { HeaderNav } from './header-nav';

export function GuestHeader() {
  return (
    <header className="w-full border-b border-color-[var(--neutral-90)] py-5">
      <Box className="mx-auto flex max-w-[1280px] items-center justify-between gap-8 px-10">
        <Box className="min-w-0 flex flex-1 items-center gap-12">
          <Link href="/" className="inline-block text-center">
            <Image src="/Logo.svg" alt="" width={70} height={40} />
          </Link>
          <HeaderNav />
        </Box>

        <Button asChild size="small" variant="primary">
          <Link href="/login">로그인</Link>
        </Button>
      </Box>
    </header>
  );
}
