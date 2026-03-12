import { QueuePageClient } from '@/features/queue/components/queue-page-client';

// TODO 소켓 연동 검증용 임시 하드코딩. 실제 연동 단계에서는 교체 필요
const DEMO_AUCTION_ID = 'auction-demo-001';
const DEMO_USER_ID = 'guest-user-001';

export default function QueuePage() {
  return <QueuePageClient auctionId={DEMO_AUCTION_ID} userId={DEMO_USER_ID} />;
}
