'use client';

import { type Ref, useState } from 'react';
import { Typography } from '@/components/ui/typography';
import { useTabIndicator } from '@/hooks/use-tab-indicator';
import { cn } from '@/lib/utils';
import {
  activityItems,
  activityTabs,
} from '@/app/(protected)/mypage/data/mock-data';
import type { ActivityTab } from '@/app/(protected)/mypage/types';
import { ActivityHistoryList } from '@/app/(protected)/mypage/components/activity-history/activity-history-list';
import { ActivityStatusBadge } from '@/app/(protected)/mypage/components/activity-history/activity-status-badge';
import { PageHeader } from '@/components/shared/page-header';
import { Box } from '@/components/ui/box';
import { Icon } from '@/components/Icon/Icon';

export function ActivityHistorySection() {
  const [activeTab, setActiveTab] = useState<ActivityTab>('draw');
  const { indicator, setContainerRef, setItemRef } = useTabIndicator(activeTab);
  const tabItems =
    activeTab === 'draw' ? activityItems.draw : activityItems.bid;
  const getTabId = (tab: ActivityTab) => `activity-history-tab-${tab}`;
  const getPanelId = (tab: ActivityTab) => `activity-history-panel-${tab}`;

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
          renderRightContent={(item) =>
            item.isResultPending ? (
              // TODO: 결과 확인 API 연동 시 onClick 구현
              <Box
                as="button"
                type="button"
                paddingX="S"
                radius="XS"
                className="bg-[var(--orange-50)] py-2 text-white flex gap-1"
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
            )
          }
        />
      </div>
    </section>
  );
}
