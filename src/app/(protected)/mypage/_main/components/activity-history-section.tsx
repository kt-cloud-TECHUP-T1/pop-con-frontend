'use client';

import { type KeyboardEvent, type Ref, useRef, useState } from 'react';
import { Typography } from '@/components/ui/typography';
import { useTabIndicator } from '@/hooks/use-tab-indicator';
import { cn } from '@/lib/utils';
import type { ActivityTab } from '@/app/(protected)/mypage/types';
import { ActivityHistoryList } from '@/app/(protected)/mypage/components/activity-history/activity-history-list';
import { ActivityStatusBadge } from '@/app/(protected)/mypage/components/activity-history/activity-status-badge';
import { BidReviewButton } from '@/app/(protected)/mypage/components/activity-history/bid-review-button';
import { PageHeader } from '@/components/shared/page-header';
import { Box } from '@/components/ui/box';
import { Icon } from '@/components/Icon/Icon';
import DrawResultModal, {
  type DrawResult,
} from '@/app/(protected)/mypage/activity/draws/components/draw-result-modal';
import { ActivityItemSkeleton } from '../../components/skeletons';
import {
  useDrawHistory,
  toDrawActivityItem,
  useConfirmDrawResult,
} from '@/app/(protected)/mypage/hooks/use-draw-history';
import {
  useBidHistory,
  toBidActivityItem,
  isBidRefunded,
} from '@/app/(protected)/mypage/hooks/use-bid-history';

const PREVIEW_COUNT = 3;

const activityTabs = [
  { label: '드로우', value: 'draw' as const },
  { label: '낙찰', value: 'bid' as const },
];

export function ActivityHistorySection() {
  const [activeTab, setActiveTab] = useState<ActivityTab>('draw');
  const [modalResult, setModalResult] = useState<DrawResult | null>(null);
  const { mutate: confirmResult, isPending: isConfirming } =
    useConfirmDrawResult();
  const { indicator, setContainerRef, setItemRef } = useTabIndicator(activeTab);
  const tabButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const {
    data: draws,
    isLoading: drawsLoading,
    isError: drawsError,
  } = useDrawHistory();
  const {
    data: bids,
    isLoading: bidsLoading,
    isError: bidsError,
  } = useBidHistory();

  const getTabId = (tab: ActivityTab) => `activity-history-tab-${tab}`;
  const getPanelId = (tab: ActivityTab) => `activity-history-panel-${tab}`;

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = activityTabs.findIndex((t) => t.value === activeTab);
    let nextIndex = currentIndex;

    if (e.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % activityTabs.length;
    } else if (e.key === 'ArrowLeft') {
      nextIndex =
        (currentIndex - 1 + activityTabs.length) % activityTabs.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = activityTabs.length - 1;
    } else {
      return;
    }

    e.preventDefault();
    setActiveTab(activityTabs[nextIndex].value);
    tabButtonRefs.current[nextIndex]?.focus();
  };

  const isDrawTab = activeTab === 'draw';
  const isLoading = isDrawTab ? drawsLoading : bidsLoading;
  const isError = isDrawTab ? drawsError : bidsError;

  const drawItems = (draws ?? [])
    .slice(0, PREVIEW_COUNT)
    .map(toDrawActivityItem);
  const bidItems = (bids ?? []).slice(0, PREVIEW_COUNT).map(toBidActivityItem);

  const items = isDrawTab ? drawItems : bidItems;

  return (
    <section>
      <div className="mb-6">
        <PageHeader
          title="활동 내역"
          titleVariant="heading-1"
          titleWeight="bold"
        />
        <div
          ref={setContainerRef as Ref<HTMLDivElement>}
          className="relative flex border-b border-black/10 gap-4"
          role="tablist"
          aria-label="활동 내역 탭"
          onKeyDown={handleKeyDown}
        >
          {activityTabs.map((tab, index) => {
            const isActive = tab.value === activeTab;
            return (
              <button
                key={tab.value}
                id={getTabId(tab.value)}
                type="button"
                ref={(el) => {
                  (setItemRef(tab.value) as (node: HTMLElement | null) => void)(
                    el
                  );
                  tabButtonRefs.current[index] = el;
                }}
                onClick={() => setActiveTab(tab.value)}
                role="tab"
                aria-selected={isActive}
                aria-controls={getPanelId(tab.value)}
                tabIndex={isActive ? 0 : -1}
                className={cn(
                  'py-4 transition-colors',
                  isActive
                    ? 'text-[var(--neutral-10)]'
                    : 'text-[var(--neutral-60)]'
                )}
              >
                <Typography variant="body-1" weight="medium">
                  {tab.label}
                </Typography>
              </button>
            );
          })}
          <span
            aria-hidden
            className={cn(
              'pointer-events-none absolute bottom-0 left-0 h-0.5 bg-[var(--neutral-10)]',
              indicator.ready
                ? 'transition-[transform,width] duration-300 ease-out'
                : ''
            )}
            style={{
              width: indicator.width,
              opacity: indicator.opacity,
              transform: `translateX(${indicator.x}px)`,
            }}
          />
        </div>
      </div>

      <div
        id={getPanelId(activeTab)}
        role="tabpanel"
        aria-labelledby={getTabId(activeTab)}
      >
        {isError && (
          <div className="min-h-[200px] flex items-center justify-center text-[var(--content-extra-low)]">
            내역을 불러오지 못했어요.
          </div>
        )}

        {!isError && isLoading && (
          <ul className="space-y-8">
            {Array.from({ length: PREVIEW_COUNT }).map((_, i) => (
              <li key={i}>
                <ActivityItemSkeleton />
              </li>
            ))}
          </ul>
        )}

        {!isError && !isLoading && items.length === 0 && (
          <div className="min-h-[200px] flex items-center justify-center text-[var(--content-extra-low)]">
            내역이 없어요.
          </div>
        )}

        {!isError && !isLoading && items.length > 0 && (
          <>
            <ActivityHistoryList
              items={items}
              renderRightContent={
                isDrawTab
                  ? (item) =>
                      item.isResultPending ? (
                        <Box
                          as="button"
                          type="button"
                          paddingX="S"
                          radius="XS"
                          className="bg-[var(--orange-50)] py-2 text-white flex gap-1 disabled:opacity-50"
                          disabled={isConfirming}
                          onClick={() =>
                            confirmResult(item.id, {
                              onSuccess: (result) => setModalResult(result),
                            })
                          }
                        >
                          <Icon
                            name="Search"
                            size={18}
                            className="text-white"
                          />
                          <Typography as="p" variant="label-3">
                            결과 확인하기
                          </Typography>
                        </Box>
                      ) : (
                        <ActivityStatusBadge
                          label={item.stateLabel}
                          tone={item.stateTone}
                        />
                      )
                  : (item) => {
                      const bid = bids?.find((b) => b.id === item.id);
                      return (
                        <BidReviewButton
                          bidId={item.id}
                          isRefunded={bid ? isBidRefunded(bid) : false}
                        />
                      );
                    }
              }
            />
          </>
        )}
      </div>

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
