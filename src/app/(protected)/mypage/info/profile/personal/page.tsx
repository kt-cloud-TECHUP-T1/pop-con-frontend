import { PageHeader } from '@/components/shared/page-header';
import { personalProfileRows } from '@/app/(protected)/mypage/data/mock-data';
import { Box } from '@/components/ui/box';
import { Typography } from '@/components/ui/typography';
import { PersonalPhoneVerifyAction } from '@/app/(protected)/mypage/info/profile/personal/components/personal-phone-verify-action';

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
              className="grid items-center gap-3 md:grid-cols-[120px_minmax(0,1fr)_78px] md:gap-[80px]"
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
                {item.action === 'verifyPhone' ? (
                  <PersonalPhoneVerifyAction />
                ) : item.action === 'edit' ? (
                  <Box
                    as="button"
                    type="button"
                    paddingY="S"
                    paddingX="M"
                    border="#0A0A0A29"
                    radius="MS"
                  >
                    <Typography
                      variant="label-1"
                      weight="medium"
                      className="whitespace-nowrap"
                    >
                      변경
                    </Typography>
                  </Box>
                ) : null}
              </div>
            </div>
          ))}
        </dl>
      </Box>
    </>
  );
}
