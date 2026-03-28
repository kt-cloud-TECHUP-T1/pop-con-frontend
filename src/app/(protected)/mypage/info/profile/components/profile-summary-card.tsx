import Image from 'next/image';
import Link from 'next/link';
import { Box } from '@/components/ui/box';
import { Typography } from '@/components/ui/typography';
import { buttonVariants } from '@/components/ui/button';

export type ProfileInfoItem = {
  label: string;
  value: string;
};

type ProfileSummaryCardProps = {
  imageSrc: string;
  nickname: string;
  infoItems: ProfileInfoItem[];
};

export function ProfileSummaryCard({
  imageSrc,
  nickname,
  infoItems,
}: ProfileSummaryCardProps) {
  return (
    <Box
      as="article"
      radius="ML"
      border="#0A0A0A14"
      className="min-h-[360px] p-8 sm:p-10"
    >
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-5">
          <Image
            src={imageSrc}
            alt="프로필 이미지"
            width={96}
            height={96}
            className="h-24 w-24 rounded-full object-cover"
          />
          <Typography variant="heading-2" weight="medium">
            {nickname}
          </Typography>
        </div>

        <dl className="grid w-full max-w-[420px] grid-cols-[100px_1fr] gap-x-4 gap-y-2">
          {infoItems.map((item) => (
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
          <Link href="/mypage/info/profile/settings" className={buttonVariants({ variant: 'tertiary', size: 'small' })}>
            프로필 설정
          </Link>
          <Link href="/mypage/info/profile/personal" className={buttonVariants({ variant: 'tertiary', size: 'small' })}>
            개인정보 수정
          </Link>
          <Link href="/mypage/info/profile/login/settings" className={buttonVariants({ variant: 'tertiary', size: 'small' })}>
            로그인 설정
          </Link>
        </div>
      </div>
    </Box>
  );
}
