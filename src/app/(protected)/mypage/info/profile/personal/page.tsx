import { PageHeader } from '@/components/shared/page-header';
import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';

type PersonalProfileRow = {
  label: string;
  value: string;
  action?: 'verifyPhone' | 'edit';
};

const personalProfileRows: PersonalProfileRow[] = [
  { label: '이름', value: '이상혁' },
  { label: '생년월일 / 성별', value: '1996.05.07 / 남' },
  { label: '이메일', value: 'Account@mail.com' },
  {
    label: '휴대폰 번호',
    value: '010-1234-5678',
    action: 'verifyPhone',
  },
];

export default function MyPagePersonalInfoPage() {
  return (
    <>
      <PageHeader
        title="개인정보 수정"
        titleVariant="heading-1"
        titleWeight="bold"
      />
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
                {item.action && (
                  <Button type="button" size="large" variant="tertiary">
                    <Typography
                      variant="label-1"
                      weight="medium"
                      className="whitespace-nowrap"
                    >
                      변경
                    </Typography>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </dl>
      </Box>
    </>
  );
}
