import { Typography } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { RADIUS } from '@/constants/design-system';

export default function SignupButton({
  disabled,
  onClick,
  isPending,
}: {
  disabled: boolean;
  onClick: () => void;
  isPending: boolean;
}) {
  return (
    <Button
      type="button"
      className={`w-full ${RADIUS.MS}`}
      size="large"
      variant="primary"
      disabled={disabled}
      onClick={onClick}
    >
      <Typography variant="label-1" weight="medium">
        {isPending ? '처리 중...' : '회원가입'}
      </Typography>
    </Button>
  );
}
