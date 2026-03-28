'use client';

import { useLoginRequiredModalStore } from '@/features/auth/stores/login-required-modal-store';
import { Box } from '../ui/box';
import { Typography } from '../ui/typography';
import { Button } from '../ui/button';
import { usePathname, useRouter } from 'next/navigation';

export default function LoginRequiredModal() {
  const isOpen = useLoginRequiredModalStore((state) => state.isOpen);
  const close = useLoginRequiredModalStore((state) => state.close);
  // const isOpen = true;
  const router = useRouter();
  const pathname = usePathname();
  if (!isOpen) return null;

  const handleLogin = () => {
    close();
    router.push(`/login?redirect=${pathname}`);
  };

  return (
    <Box className="fixed inset-0 flex items-center justify-center bg-black/50 ">
      <Box radius="LG" className="py-s bg-[var(--bg-default)] w-[480px]">
        <div className="flex flex-col items-center gap-xs py-s px-ms">
          <Typography variant="title-1" weight="bold">
            로그인이 필요한 기능입니다.
          </Typography>
          <Typography
            variant="body-1"
            weight="regular"
            className="text-[var(--content-extra-low)]"
          >
            로그인 후 팝콘의 모든 기능을 이용하세요.
          </Typography>
        </div>
        <div className="flex gap-xs py-s px-ms">
          <Button variant="secondary" className="flex-1" onClick={close}>
            <Typography variant="label-1">취소</Typography>
          </Button>
          <Button className="flex-1" onClick={handleLogin}>
            <Typography variant="label-1">로그인하기</Typography>
          </Button>
        </div>
      </Box>
    </Box>
  );
}
