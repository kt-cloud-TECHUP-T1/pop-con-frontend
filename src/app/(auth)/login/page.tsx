// 로그인

import { Icon } from '@/components/Icon/Icon';
import { Wrapper } from '@/components/layout/wrapper';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';

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
            <Icon name="Kakao" size={20} className="text-[var(--neutral-30)]" />
          }
        >
          <Typography variant="label-1" weight="medium" className="text-black">
            카카오 로그인
          </Typography>
        </Button>
        <Button
          size="large"
          className="w-full bg-[#03C75A] hover:bg-[#03C75A] active:bg-[#03C75A]"
          leftIcon={<Icon name="Naver" size={20} />}
        >
          <Typography variant="label-1" weight="medium">
            네이버 로그인
          </Typography>
        </Button>
      </div>
    </Wrapper>
  );
}
