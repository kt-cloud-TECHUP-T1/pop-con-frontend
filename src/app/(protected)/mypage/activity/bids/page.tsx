import { BidsPageClient } from './components/bids-page-client';
import { PageHeader } from '@/components/shared/page-header';

export default function MyPageActivityBidsPage() {
  return (
    <>
      <PageHeader
        title="낙찰 내역"
        titleVariant="heading-1"
        titleWeight="bold"
      />
      <BidsPageClient />
    </>
  );
}
