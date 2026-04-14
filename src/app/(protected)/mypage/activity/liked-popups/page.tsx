import { LikedPopupsPageClient } from './components/liked-popups-page-client';
import { PageHeader } from '@/components/shared/page-header';

export default function MyPageActivityLikedPopupsPage() {
  return (
    <section>
      <PageHeader
        title="찜한 팝업스토어"
        titleVariant="heading-1"
        titleWeight="bold"
      />
      <LikedPopupsPageClient />
    </section>
  );
}
