'use client';

import { useUserMeQuery } from '@/features/user/queries/use-user-me-query';
import { ProfileSummaryCard } from './profile-summary-card';

const FALLBACK_PROFILE_IMAGE = '/images/temp/no-image.png';

export function ProfileSummaryCardClient() {
  const { data: userMe } = useUserMeQuery();

  const profileImage = userMe?.profileImage || FALLBACK_PROFILE_IMAGE;
  const nickname = userMe?.nickname ?? '';
  const birthDate = userMe?.birthDate
    ? userMe.birthDate.replace(/-/g, '.')
    : '';

  const infoItems = [
    { label: '이름', value: userMe?.name ?? '' },
    { label: '생년월일', value: birthDate },
    { label: '휴대폰 번호', value: userMe?.phone ?? '' },
    { label: '이메일', value: userMe?.email ?? '' },
  ];

  return (
    <ProfileSummaryCard
      imageSrc={profileImage}
      nickname={nickname}
      infoItems={infoItems}
    />
  );
}
