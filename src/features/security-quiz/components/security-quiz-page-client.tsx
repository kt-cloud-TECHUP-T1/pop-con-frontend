import { Icon } from '@/components/Icon/Icon';
import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Typography } from '@/components/ui/typography';
import Image from 'next/image';

export const SecurityQuizPageClient = () => {
  return (
    <section className="flex min-h-screen items-center justify-center bg-black/45 px-5 py-10">
      <Box
        radius="ML"
        padding="M"
        background="white"
        className="w-full max-w-[480px] "
      >
        {/* 타이틀 */}
        <div className="text-center">
          <Typography
            variant="heading-1"
            weight="bold"
            className="text-[var(--content-high)]"
          >
            보안 퀴즈
          </Typography>
          <Typography
            variant="label-2"
            className="mt-3 text-[var(--content-extra-low)]"
          >
            비정상 접근을 방지하기 위해 문제를 풀어주세요.
          </Typography>
        </div>
        {/* 남은 시간 */}
        <Box
          background="var(--component-default)"
          paddingX="_3XS"
          paddingY="XS"
          radius="MS"
          className="mt-8 text-center"
        >
          <Typography
            variant="body-1"
            className="text-[var(--content-extra-low)]"
          >
            남은 시간{' '}
            <Typography
              as="span"
              variant="body-1"
              weight="bold"
              className="text-[var(--btn-primary-default)]"
            >
              30초
            </Typography>
          </Typography>
        </Box>
        {/* 영상 */}
        <Box radius="ML" className="mt-4 h-[234px] overflow-hidden">
          <Image
            src="/images/temp/no-image.png"
            width={416}
            height={234}
            alt=""
            className="w-full h-full object-cover"
          />
        </Box>

        <div className="mt-6">
          <Typography
            variant="title-2"
            weight="bold"
            className="text-center text-[var(--content-high)]"
          >
            영상 속에 보이는 숫자는 무엇인가요?
          </Typography>

          <div className="mt-6">
            <Input
              placeholder="답을 입력해주세요."
              inputSize="large"
              maxLength={8}
            />
          </div>

          <Button type="button" size="large" className="mt-4 w-full">
            확인
          </Button>
        </div>
        {/* 경고 문구 */}
        <div className="mt-8 flex items-center justify-center text-center">
          <Icon
            name="InfoFill"
            size={20}
            className="mr-0.5 shrink-0 text-[var(--content-extra-low)]"
          />
          <Typography
            variant="caption-1"
            className="text-[var(--content-extra-low)]"
          >
            3회 오답 시 30분간 접근이 제한됩니다.
          </Typography>
        </div>
      </Box>
    </section>
  );
};
