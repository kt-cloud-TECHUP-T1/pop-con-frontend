import { DrawsPageClient } from './components/draws-page-client';
import { PageHeader } from '@/components/shared/page-header';
import type { DrawStatusFilter } from '@/app/(protected)/mypage/lib/draw-status';
import { DRAW_STATUS_FILTERS } from '@/app/(protected)/mypage/lib/draw-status';

type Props = {
  searchParams: Promise<{ filter?: string }>;
};

export default async function MyPageActivityDrawsPage({ searchParams }: Props) {
  const { filter } = await searchParams;
  const initialFilter = DRAW_STATUS_FILTERS.some((f) => f.value === filter)
    ? (filter as DrawStatusFilter)
    : null;

  return (
    <>
      <PageHeader
        title="드로우 응모 내역"
        titleVariant="heading-1"
        titleWeight="bold"
      />
      <DrawsPageClient initialFilter={initialFilter} />
    </>
  );
}
