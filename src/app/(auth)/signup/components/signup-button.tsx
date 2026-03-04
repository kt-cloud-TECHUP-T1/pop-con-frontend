
import { Typography } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';

export default function SignupButton({
  disabled,
}: {
  disabled: boolean;
}) {
  

  return (
    <Button type='submit' className='w-full' size="large" variant="primary" disabled={disabled}>
        <Typography variant="label-1" weight="medium">
        회원가입
        </Typography>
    </Button>
  );
}
