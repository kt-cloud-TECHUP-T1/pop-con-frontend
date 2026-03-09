import { Icon } from '@/components/Icon/Icon';
import { Box } from '@/components/ui/box';
import { Typography } from '@/components/ui/typography';

export function AddPaymentMethodButton() {
  return (
    <Box
      as="button"
      radius="MS"
      border="#D9D9D9"
      paddingY="S"
      paddingX="MS"
      className="inline-flex w-full max-w-[180px] items-center justify-center gap-2"
    >
      <Icon name="Plus" size={20} />
      <Typography variant="label-1" weight="medium">
        새 결제수단 등록
      </Typography>
    </Box>
  );
}
