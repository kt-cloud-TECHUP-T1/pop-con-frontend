
import { Typography } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';

export default function SignupButton({
  disabled,
  isPending = false,
}: {
  disabled: boolean;
  isPending?: boolean;
}) {
  return (
    <Button
      type="submit"
      className="w-full"
      size="large"
      variant="primary"
      disabled={disabled || isPending}
    >
      <Typography variant="label-1" weight="medium">
        {isPending ? '처리 중...' : '회원가입'}
      </Typography>
    </Button>
  );
}
