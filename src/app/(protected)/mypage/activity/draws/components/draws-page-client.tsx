'use client';

import { ActivityStatusBadge } from '@/app/(protected)/mypage/components/activity-history/activity-status-badge';
import { ActivityHistoryList } from '@/app/(protected)/mypage/components/activity-history/activity-history-list';
import { ActivityStatusFilters } from '@/app/(protected)/mypage/components/activity-history/activity-status-filters';
import { drawStatusFilters } from '@/features/mypage/draws/data/mock-draw-history';
import { DrawResultRevealModal } from '@/features/mypage/draws/components/draw-result-reveal-modal';
import { useDrawHistoryFilter } from '@/features/mypage/draws/hooks/use-draw-history-filter';
import { useDrawReveal } from '@/features/mypage/draws/hooks/use-draw-reveal';
import { formatWon } from '@/lib/utils';
import { Box } from '@/components/ui/box';
import { Typography } from '@/components/ui/typography';
import { Icon } from '@/components/Icon/Icon';

export function DrawsPageClient() {
  const {
    setDrawHistory,
    activeFilters,
    toggleActiveFilter,
    filteredDrawHistory,
  } = useDrawHistoryFilter();
  const {
    selectedItem,
    isRevealing,
    revealedResult,
    revealError,
    closeRevealModal,
    handleRevealResult,
  } = useDrawReveal({
    setItems: setDrawHistory,
    canReveal: (item) =>
      item.statusFilter === 'pendingResult' && Boolean(item.revealResult),
    getMockResult: (item) => item.revealResult,
    applyRevealResult: (item, result, badge) => ({
      ...item,
      statusFilter: result,
      statusLabel: badge.label,
      statusTone: badge.tone,
    }),
  });

  return (
    <>
      <section>
        <ActivityStatusFilters
          options={drawStatusFilters}
          activeValues={activeFilters}
          onToggle={toggleActiveFilter}
        />
        <ActivityHistoryList
          items={filteredDrawHistory}
          getTitle={(item) => item.title}
          getPrice={(item) => formatWon(item.amount)}
          getPaidAt={(item) => item.paidAt}
          renderRightContent={(item) =>
            item.statusFilter === 'pendingResult' ? (
              <Box
                as="button"
                type="button"
                paddingX="S"
                radius="XS"
                onClick={() => handleRevealResult(item)}
                disabled={isRevealing}
                className="bg-[var(--orange-50)] py-2 text-white flex gap-1"
              >
                <Icon name="Search" size={18} className="text-white" />
                <Typography as="p" variant="label-3">
                  결과 확인하기
                </Typography>
              </Box>
            ) : (
              <ActivityStatusBadge
                label={item.statusLabel}
                tone={item.statusTone}
              />
            )
          }
        />
      </section>

      {/* 결과 확인하기 -> 모달창 */}
      <DrawResultRevealModal
        isOpen={selectedItem !== null}
        isRevealing={isRevealing}
        revealedResult={revealedResult}
        revealError={revealError}
        onClose={closeRevealModal}
      />
    </>
  );
}
