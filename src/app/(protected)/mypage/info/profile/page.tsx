import { PageHeader } from '@/components/shared/page-header';
import { ProfileSummaryCardClient } from './components/profile-summary-card-client';

export default function MyPageProfilePage() {
  return (
    <section className="max-w-[960px]">
      <PageHeader
        title="프로필 관리"
        titleVariant="heading-1"
        titleWeight="bold"
      />
      <ProfileSummaryCardClient />
    </section>
  );
}
