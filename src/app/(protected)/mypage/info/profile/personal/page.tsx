import { PageHeader } from '@/components/shared/page-header';
import { PersonalPageClient } from './components/personal-page-client';

export default function MyPagePersonalInfoPage() {
  return (
    <>
      <PageHeader
        title="개인정보 수정"
        titleVariant="heading-1"
        titleWeight="bold"
      />
      <PersonalPageClient />
    </>
  );
}
