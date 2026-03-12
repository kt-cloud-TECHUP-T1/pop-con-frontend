import { QueuePageClient } from '@/features/queue/components/queue-page-client';

const DEMO_AUCTION_ID = 'auction-demo-001';
const DEMO_USER_ID = 'guest-user-001';

export default function QueuePage() {
  return <QueuePageClient auctionId={DEMO_AUCTION_ID} userId={DEMO_USER_ID} />;
}
