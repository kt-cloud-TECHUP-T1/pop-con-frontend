import Image from 'next/image';
import Link from 'next/link';
import { Box } from '@/components/ui/box';
import { Button, buttonVariants } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';

const PROFILE_INFO = [
  { label: '이름', value: '이상혁' },
  { label: '생년월일', value: '1996.05.07' },
  { label: '휴대폰 번호', value: '010-1234-5678' },
  { label: '이메일', value: 'account@mail.com' },
] as const;

export default function MyPageInfoProfilePage() {
  return (
    <section className="max-w-[960px]">
      <header className="mb-8">
        <Typography variant="heading-1" weight="bold">
          프로필 관리
        </Typography>
      </header>

      <Box
        as="article"
        radius="ML"
        border="#0A0A0A14"
        className="min-h-[360px] p-8 sm:p-10"
      >
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-5">
            <Image
              src="/images/temp/God-Sang-hyeok.png"
              alt="프로필 이미지"
              width={96}
              height={96}
              className="h-24 w-24 rounded-full object-cover"
            />
            <Typography variant="heading-2" weight="medium">
              심심한 고래
            </Typography>
          </div>

          <dl className="grid w-full max-w-[420px] grid-cols-[100px_1fr] gap-x-4 gap-y-2">
            {PROFILE_INFO.map((item) => (
              <div key={item.label} className="contents">
                <dt>
                  <Typography variant="label-1" weight="regular">
                    {item.label}
                  </Typography>
                </dt>
                <dd>
                  <Typography
                    variant="label-1"
                    className="text-[var(--neutral-60)]"
                  >
                    {item.value}
                  </Typography>
                </dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/mypage/info/profile/settings"
              className={buttonVariants({ variant: 'tertiary', size: 'small' })}
            >
              프로필 설정
            </Link>
            <Button variant="tertiary" size="small">
              개인정보 수정
            </Button>
          </div>
        </div>
      </Box>
    </section>
  );
}
