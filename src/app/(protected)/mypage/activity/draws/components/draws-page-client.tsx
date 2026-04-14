'use client';

import { useState } from 'react';
import { ActivityStatusBadge } from '@/app/(protected)/mypage/components/activity-history/activity-status-badge';
import { ActivityHistoryList } from '@/app/(protected)/mypage/components/activity-history/activity-history-list';
import { ActivityStatusFilters } from '@/app/(protected)/mypage/components/activity-history/activity-status-filters';
import { Box } from '@/components/ui/box';
import { Typography } from '@/components/ui/typography';
import { Icon } from '@/components/Icon/Icon';
import {
  type DrawStatusFilter,
  DRAW_STATUS_FILTERS,
  getDrawStatusFilter,
} from '@/app/(protected)/mypage/lib/draw-status';
import DrawResultModal, { type DrawResult } from './draw-result-modal';
import { ActivityItemSkeleton } from '../../../components/skeletons';
import {
  useDrawHistory,
  toDrawActivityItem,
} from '@/app/(protected)/mypage/hooks/use-draw-history';

export function DrawsPageClient() {
  const { data: draws, isLoading, isError } = useDrawHistory();
  const [activeFilter, setActiveFilter] = useState<DrawStatusFilter | null>(null);
  const [modalResult, setModalResult] = useState<DrawResult | null>(null);

  const handleToggle = (value: DrawStatusFilter) => {
    setActiveFilter((prev) => (prev === value ? null : value));
  };

  if (isError) {
    return (
      <div className="min-h-[200px] flex items-center justify-center text-[var(--content-extra-low)]">
        드로우 응모 내역을 불러오지 못했어요.
      </div>
    );
  }

  if (isLoading) {
    return (
      <ul className="space-y-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <li key={i}>
            <ActivityItemSkeleton />
          </li>
        ))}
      </ul>
    );
  }

  if (!draws) return null;

  const filteredDraws = activeFilter
    ? draws.filter((item) => getDrawStatusFilter(item.status) === activeFilter)
    : draws;

  const items = filteredDraws.map(toDrawActivityItem);

  return (
    <section>
      <ActivityStatusFilters
        options={DRAW_STATUS_FILTERS}
        activeValues={activeFilter ? [activeFilter] : []}
        onToggle={handleToggle}
      />

      {draws.length === 0 && (
        <div className="min-h-[200px] flex items-center justify-center text-[var(--content-extra-low)]">
          드로우 응모 내역이 없어요.
        </div>
      )}

      {draws.length > 0 && (
        <ActivityHistoryList
          items={items}
          renderRightContent={(item) => {
            const draw = filteredDraws.find((d) => d.id === item.id)!;
            const filter = getDrawStatusFilter(draw.status);

            return filter === 'pendingResult' ? (
              <Box
                as="button"
                type="button"
                paddingX="S"
                radius="XS"
                className="bg-[var(--orange-50)] py-2 text-white flex gap-1"
                onClick={() => setModalResult('won')}
              >
                <Icon name="Search" size={18} className="text-white" />
                <Typography as="p" variant="label-3">
                  결과 확인하기
                </Typography>
              </Box>
            ) : (
              <ActivityStatusBadge
                label={item.stateLabel}
                tone={item.stateTone}
              />
            );
          }}
        />
      )}

      {modalResult && (
        <DrawResultModal
          isOpen={!!modalResult}
          result={modalResult}
          onClose={() => setModalResult(null)}
        />
      )}
    </section>
  );
}
