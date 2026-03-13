import { DrawsPageClient } from './components/draws-page-client';
import { PageHeader } from '@/components/shared/page-header';

export default function MyPageActivityDrawsPage() {
  return (
    <>
      <PageHeader
        title="드로우 응모 내역"
        titleVariant="heading-1"
        titleWeight="bold"
      />
      <DrawsPageClient />
    </>
  );
}
