import { DrawsPageClient } from './components/draws-page-client';
import { MyPageHeader } from '@/app/(protected)/mypage/components/page-header';

export default function MyPageActivityDrawsPage() {
  return (
    <>
      <MyPageHeader
        title="드로우 응모 내역"
        titleVariant="heading-1"
        titleWeight="bold"
      />
      <DrawsPageClient />
    </>
  );
}
