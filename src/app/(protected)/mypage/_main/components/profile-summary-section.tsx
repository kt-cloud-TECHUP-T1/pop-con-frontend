'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { IconName } from '@/components/Icon/Icon';
import { Icon } from '@/components/Icon/Icon';
import { Box } from '@/components/ui/box';
import { Typography } from '@/components/ui/typography';
import { useUserMeQuery } from '@/features/user/queries/use-user-me-query';
import { useUserStatistics } from '@/app/(protected)/mypage/hooks/use-user-statistics';

const SUMMARY_STATS_META: { label: string; link: string }[] = [
  { label: '드로우 당첨', link: '/mypage/activity/draws?filter=won' },
  { label: '드로우 미당첨', link: '/mypage/activity/draws?filter=notWon' },
  { label: '진행중인 드로우', link: '/mypage/activity/draws?filter=inProgress' },
  { label: '결과 확인 대기중', link: '/mypage/activity/draws?filter=pendingResult' },
  { label: '낙찰 수', link: '/mypage/activity/bids' },
  { label: '찜한 수', link: '/mypage/activity/liked-popups' },
];

const FALLBACK_PROFILE_IMAGE = '/images/temp/no-image.png';

export function ProfileSummarySection() {
  const { data: userMe } = useUserMeQuery();
  const { data: statistics } = useUserStatistics();

  const profileImage = userMe?.profileImage || FALLBACK_PROFILE_IMAGE;
  const nickname = userMe?.nickname ?? '';
  const email = userMe?.email ?? '';
  const phone = userMe?.phone ?? '';
  const joinDate = userMe?.joinDate
    ? `가입일 ${userMe.joinDate.replace(/-/g, '.')}`
    : '';

  const summaryCards: { label: string; value: number | string; icon: IconName; link: string }[] = [
    { label: '내 티켓', value: statistics?.ticketCount ?? '-', icon: 'Ticket', link: '/mypage/info/tickets' },
    { label: '드로우 내역', value: statistics?.totalDrawCount ?? '-', icon: 'Roulette', link: '/mypage/activity/draws' },
    { label: '낙찰 내역', value: statistics?.totalAuctionCount ?? '-', icon: 'Gavel', link: '/mypage/activity/bids' },
    { label: '작성한 리뷰', value: statistics?.reviewCount ?? '-', icon: 'Like', link: '/mypage/activity/reviews' },
  ];

  const summaryStats = SUMMARY_STATS_META.map((meta, i) => ({
    ...meta,
    value: [
      statistics?.wonDrawCount,
      statistics?.lostDrawCount,
      statistics?.ongoingDrawCount,
      statistics?.waitingResultDrawCount,
      statistics?.wonAuctionCount,
      statistics?.likedPopupCount,
    ][i] ?? '-',
  }));

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
                src={profileImage}
                alt="프로필 이미지"
                width={72}
                height={72}
                className="object-cover"
              />
            </Box>
            <div className="space-y-2">
              <Typography variant="title-1" weight="medium">
                {nickname}
              </Typography>
              <div className="flex flex-col text-[var(--neutral-60)] md:flex-row md:flex-wrap md:items-center">
                <Typography
                  variant="body-1"
                  className="after:mx-2 after:content-['|'] last:after:hidden after:text-[#0A0A0A]/8"
                >
                  {email}
                </Typography>
                <Typography
                  variant="body-1"
                  className="after:mx-2 after:content-['|'] last:after:hidden after:text-[#0A0A0A]/8"
                >
                  {phone}
                </Typography>
                <Typography variant="body-1">{joinDate}</Typography>
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
            as="a"
            href={card.link}
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
        border="var(--component-disabled)"
        padding="S"
        radius="ML"
        className="grid gap-4 overflow-hidden md:grid-cols-3 xl:grid-cols-6"
      >
        {summaryStats.map((stat) => (
          <Box
            as={Link}
            href={stat.link}
            key={stat.label}
            padding="XS"
            className="
              relative bg-white pr-4
              after:content-['']
              after:absolute after:-right-2 after:top-1/2 after:-translate-y-1/2
              after:w-px after:h-full
              after:bg-[#0A0A0A]/8
              last:after:hidden
              text-right
              hover:opacity-70 transition-opacity
            "
          >
            <Typography variant="label-2" weight="bold">
              {stat.label}
            </Typography>
            <Typography
              variant="title-2"
              weight="bold"
              as="p"
              className="mt-1 text-[var(--content-extra-low)]"
            >
              {stat.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </section>
  );
}
