// 로그인

import { Wrapper } from '@/components/layout/wrapper';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import Image from 'next/image';
import Link from 'next/link';

export default function Login() {
  return (
    <Wrapper className="pt-[120px]">
      <Typography weight="bold" variant="heading-1" className="text-center">
        로그인
      </Typography>

      <div className="btn-group w-full max-w-[360px] mx-auto flex flex-col gap-3 pt-ml">
        <Button
          size="large"
          className="w-full bg-[#FEE500] hover:bg-[#FEE500] active:bg-[#FEE500]"
          leftIcon={
            <Image
              src="/icons/kakao.svg"
              width={24}
              height={24}
              alt="카카오"
            ></Image>
          }
        >
          <Typography variant="label-1" weight="medium" className="text-black">
            카카오 로그인
          </Typography>
        </Button>
        <Link href={`https://devapi.popcon.store/auth/oauth/naver`}>
          <Button
            size="large"
            className="w-full bg-[#03C75A] hover:bg-[#03C75A] active:bg-[#03C75A]"
          >
            <Typography variant="label-1" weight="medium">
              네이버 로그인
            </Typography>
          </Button>
        </Link>
      </div>
    </Wrapper>
  );
}
