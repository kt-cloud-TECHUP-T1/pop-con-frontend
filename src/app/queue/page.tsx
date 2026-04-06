import { QueuePageClient } from '@/features/queue/components/queue-page-client';
import { Suspense } from 'react';

export default function QueuePage() {
  return (
    <Suspense fallback={null}>
      <QueuePageClient />
    </Suspense>
  );
}
