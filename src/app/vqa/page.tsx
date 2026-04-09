import { Wrapper } from '@/components/layout/wrapper';
import VqaForm from './containers/vqa-form';

export default function VqaPage() {
  return (
    <Wrapper className="max-w-[480px] p-0 mt-[120px]">
      <VqaForm />
    </Wrapper>
  );
}
