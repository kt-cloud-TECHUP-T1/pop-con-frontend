// 본인 인증 페이지

import { Wrapper } from '@/components/layout/wrapper';
import { Box } from '@/components/ui/box';
import { Typography } from '@/components/ui/typography';

export default function Verify() {
  return (
    <Wrapper>
      <Typography
        variant="heading-1"
        weight="bold"
        className="text-center mb-10"
      >
        휴대폰 번호로
        <br /> 본인 인증해주세요.
      </Typography>
      <Box
        className="w-full max-w-[360px] bg-[#F35E11] text-center py-3 mx-auto"
        radius="MS"
      >
        <button type="button">
          <Typography variant="label-1" className="text-white">
            인증하기
          </Typography>
        </button>
      </Box>
    </Wrapper>
  );
}
