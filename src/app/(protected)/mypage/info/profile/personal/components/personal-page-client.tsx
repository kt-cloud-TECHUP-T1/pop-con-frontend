'use client';

import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { useUserMeQuery } from '@/features/user/queries/use-user-me-query';
import { usePhoneChange } from '../hooks/use-phone-change';

type PersonalProfileRow = {
  label: string;
  value: string;
  action?: 'verifyPhoneChange';
};

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

  const personalProfileRows: PersonalProfileRow[] = [
    { label: '이름', value: nickname },
    { label: '생년월일 / 성별', value: birthAndGender },
    { label: '이메일', value: email },
    { label: '휴대폰 번호', value: phone, action: 'verifyPhoneChange' },
  ];

  return (
    <Box as="article" radius="ML" border="#0A0A0A14" padding="ML">
      <dl className="space-y-8 md:space-y-6">
        {personalProfileRows.map((item) => (
          <div
            key={item.label}
            className="grid items-center gap-3 min-h-[48px] md:grid-cols-[120px_minmax(0,1fr)_78px] md:gap-[80px]"
          >
            <dt className="text-[var(--neutral-20)]">
              <Typography variant="body-1" as="span">
                {item.label}
              </Typography>
            </dt>
            <dd className="text-[var(--neutral-20)]">
              <Typography variant="label-1" as="span">
                {item.value}
              </Typography>
            </dd>
            <div className="md:justify-self-end">
              {item.action === 'verifyPhoneChange' && (
                <Button
                  type="button"
                  size="large"
                  variant="tertiary"
                  disabled={isPending}
                  onClick={handleClickPhoneChange}
                >
                  <Typography
                    variant="label-1"
                    weight="medium"
                    className="whitespace-nowrap"
                  >
                    {isPending ? '처리 중...' : '변경'}
                  </Typography>
                </Button>
              )}
            </div>
          </div>
        ))}
      </dl>
    </Box>
  );
}
