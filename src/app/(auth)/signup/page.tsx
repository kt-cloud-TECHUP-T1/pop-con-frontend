import { Wrapper } from '@/components/layout/wrapper';
import { Typography } from '@/components/ui/typography';
import TermsAgreements from './containers/terms-agreements';

export default function SignupPage() {
  
  return (
    <Wrapper className="max-w-[360px] p-0 mt-[120px]">
      <Typography className='text-center mb-10' variant="heading-1" weight="bold">회원가입</Typography>
      <TermsAgreements />
    </Wrapper>
  );
}
