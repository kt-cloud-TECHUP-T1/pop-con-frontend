import { MyPageHeader } from '@/app/(protected)/mypage/components/page-header';
import { personalProfileRows } from '@/app/(protected)/mypage/data/mock-data';
import { Box } from '@/components/ui/box';
import { Typography } from '@/components/ui/typography';

export default function MyPagePersonalInfoPage() {
  return (
    <>
      <MyPageHeader
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
                {item.action === 'verifyPhone' || item.action === 'edit' ? (
                  <Box
                    as="button"
                    type="button"
                    paddingY="S"
                    paddingX="M"
                    border="#0A0A0A29"
                    radius="MS"
                    disabled
                  >
                    <Typography
                      variant="label-1"
                      weight="medium"
                      className="whitespace-nowrap text-[var(--neutral-50)]"
                    >
                      준비중
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
