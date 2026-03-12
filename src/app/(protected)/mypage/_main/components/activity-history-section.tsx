'use client';

import { type Ref, useState } from 'react';
import { Box } from '@/components/ui/box';
import { Typography } from '@/components/ui/typography';
import { useTabIndicator } from '@/hooks/use-tab-indicator';
import { cn } from '@/lib/utils';
import {
  activityItems,
  activityTabs,
} from '@/app/(protected)/mypage/data/mock-data';
import type { ActivityItem, ActivityTab } from '@/features/mypage/types/main';
import { ActivityHistoryList } from '@/app/(protected)/mypage/components/activity-history/activity-history-list';
import { ActivityStatusBadge } from '@/app/(protected)/mypage/components/activity-history/activity-status-badge';
import { Icon } from '@/components/Icon/Icon';
import { DrawResultRevealModal } from '@/features/mypage/draws/components/draw-result-reveal-modal';
import { useDrawReveal } from '@/features/mypage/draws/hooks/use-draw-reveal';
import { MyPageHeader } from '../../components/page-header';

export function ActivityHistorySection() {
  const [activeTab, setActiveTab] = useState<ActivityTab>('draw');
  const [drawActivityItems, setDrawActivityItems] = useState(
    activityItems.draw
  );
  const {
    selectedItem,
    isRevealing,
    revealedResult,
    revealError,
    closeRevealModal,
    handleRevealResult,
  } = useDrawReveal<ActivityItem>({
    setItems: setDrawActivityItems,
    canReveal: (item) =>
      Boolean(item.isResultPending && item.pendingResultMock),
    getMockResult: (item) => item.pendingResultMock,
    applyRevealResult: (item, _, badge) => ({
      ...item,
      stateLabel: badge.label,
      stateTone: badge.tone,
      isResultPending: false,
      pendingResultMock: undefined,
    }),
  });
  const { indicator, setContainerRef, setItemRef } = useTabIndicator(activeTab);
  const tabItems = activeTab === 'draw' ? drawActivityItems : activityItems.bid;
  const getTabId = (tab: ActivityTab) => `activity-history-tab-${tab}`;
  const getPanelId = (tab: ActivityTab) => `activity-history-panel-${tab}`;

  return (
    <>
      <section>
        <div className="mb-6">
          <MyPageHeader
            title="활동 내역"
            titleVariant="heading-1"
            titleWeight="bold"
          />
          <div
            ref={setContainerRef as Ref<HTMLDivElement>}
            className="relative flex border-b border-black/10"
            role="tablist"
            aria-label="활동 내역 탭"
          >
            {/* 탭 */}
            {activityTabs.map((tab) => {
              const isActive = tab.value === activeTab;

              return (
                <button
                  key={tab.value}
                  id={getTabId(tab.value)}
                  type="button"
                  ref={setItemRef(tab.value) as Ref<HTMLButtonElement>}
                  onClick={() => setActiveTab(tab.value)}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={getPanelId(tab.value)}
                  tabIndex={isActive ? 0 : -1}
                  className={cn(
                    'min-w-[180px] px-6 py-4 transition-colors',
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
            {/* 인디케이터 */}
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
          <ActivityHistoryList
            items={tabItems}
            getTitle={(item) => item.title}
            getPrice={(item) => item.price}
            getPaidAt={(item) => item.paidAt}
            renderRightContent={(item) =>
              activeTab === 'draw' && item.isResultPending ? (
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
                <ActivityStatusBadge label={item.stateLabel} tone={item.stateTone} />
              )
            }
          />
        </div>
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
