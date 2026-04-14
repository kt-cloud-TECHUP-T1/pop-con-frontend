import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';

export type PersonalProfileRow = {
  label: string;
  value: string;
  action?: 'verifyPhoneChange';
};

type PersonalProfileListProps = {
  rows: PersonalProfileRow[];
  isPending: boolean;
  onClickPhoneChange: () => void;
};

export function PersonalProfileList({
  rows,
  isPending,
  onClickPhoneChange,
}: PersonalProfileListProps) {
  return (
    <Box as="article" radius="ML" border="#0A0A0A14" padding="ML">
      <dl className="space-y-8 md:space-y-6">
        {rows.map((item) => (
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
                  onClick={onClickPhoneChange}
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
