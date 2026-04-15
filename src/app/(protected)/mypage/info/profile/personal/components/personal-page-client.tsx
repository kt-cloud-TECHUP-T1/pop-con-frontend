'use client';

import { useUserMeQuery } from '@/features/user/queries/use-user-me-query';
import { usePhoneChange } from '../hooks/use-phone-change';
import { PersonalProfileList } from './personal-profile-list';

const GENDER_LABEL: Record<string, string> = {
  MALE: '남성',
  FEMALE: '여성',
};

export function PersonalPageClient() {
  const { data: userMe } = useUserMeQuery();
  const { handleClickPhoneChange, isPending } = usePhoneChange();

  const nickname = userMe?.name ?? '';
  const birth = userMe?.birthDate ?? '';
  const gender = userMe?.gender;
  const email = userMe?.email ?? '';
  const phone = userMe?.phone ?? '';

  const birthAndGender =
    birth && gender ? `${birth} / ${GENDER_LABEL[gender] ?? gender}` : birth;

  const rows = [
    { label: '이름', value: nickname },
    { label: '생년월일 / 성별', value: birthAndGender },
    { label: '이메일', value: email },
    { label: '휴대폰 번호', value: phone, action: 'verifyPhoneChange' as const },
  ];

  return (
    <PersonalProfileList
      rows={rows}
      isPending={isPending}
      onClickPhoneChange={handleClickPhoneChange}
    />
  );
}
