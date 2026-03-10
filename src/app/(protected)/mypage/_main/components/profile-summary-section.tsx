import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@/components/Icon/Icon';
import { Box } from '@/components/ui/box';
import { Typography } from '@/components/ui/typography';
import {
  summaryCards,
  summaryStats,
} from '@/app/(protected)/mypage/data/mock-data';

export function ProfileSummarySection() {
  return (
    <section className="space-y-2">
      {/* 프로필 */}
      <Box
        as="section"
        radius="ML"
        border="#0A0A0A14"
        padding="MS"
        className="mb-[80px]"
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <Box radius="FULL" className="h-[72px] w-[72px] overflow-hidden">
              <Image
                src="/images/temp/God-Sang-hyeok.png"
                alt="프로필 이미지"
                width={72}
                height={72}
                className="object-cover"
              />
            </Box>
            <div className="space-y-2">
              <Typography variant="title-1" weight="medium">
                심심한 고래
              </Typography>
              <div className="flex flex-col text-[var(--neutral-60)] md:flex-row md:flex-wrap md:items-center">
                <Typography
                  variant="body-1"
                  className="after:mx-2 after:content-['|'] last:after:hidden after:text-[#0A0A0A]/8"
                >
                  account@mail.com
                </Typography>
                <Typography
                  variant="body-1"
                  className="after:mx-2 after:content-['|'] last:after:hidden after:text-[#0A0A0A]/8"
                >
                  010-1234-5678
                </Typography>
                <Typography variant="body-1">가입일 2025.01.01</Typography>
              </div>
            </div>
          </div>
          <Link
            href="/mypage/info/profile"
            className="text-[var(--neutral-60)]"
          >
            <Typography variant="label-2">프로필 관리</Typography>
          </Link>
        </div>
      </Box>
      {/* 활동 내역 1(내 티켓, 드로우 내역 등) */}
      <div className="grid gap-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <Box
            as="article"
            key={card.label}
            radius="ML"
            border="#0A0A0A14"
            background="var(--neutral-99)"
            className="bg-white p-6"
            padding="MS"
          >
            <div className="flex items-start justify-between gap-3">
              <Icon name={card.icon} size={32} />

              <Typography variant="title-2" weight="bold" className="pt-1">
                {card.label}
              </Typography>
            </div>
            <Typography
              variant="heading-1"
              weight="bold"
              className="text-right text-[var(--orange-50)]"
            >
              {card.value}
            </Typography>
          </Box>
        ))}
      </div>
      {/* 활동 내역 2(드로우 당첨/미당첨, 진행중인 드로우 등) */}
      <Box
        border="#0A0A0A14"
        padding="S"
        radius="ML"
        className="grid gap-4 overflow-hidden md:grid-cols-3 xl:grid-cols-6"
      >
        {summaryStats.map((stat) => (
          <Box
            key={stat.label}
            padding="XS"
            className="
              relative bg-white pr-4
              after:content-['']
              after:absolute after:-right-2 after:top-1/2 after:-translate-y-1/2
              after:w-px after:h-full
              after:bg-[#0A0A0A]/8
              last:after:hidden
            "
          >
            <Typography variant="label-2" weight="bold">
              {stat.label}
            </Typography>
            <Typography
              variant="label-2"
              weight="medium"
              as="p"
              className="mt-1 text-[var(--neutral-60)]"
            >
              {stat.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </section>
  );
}
