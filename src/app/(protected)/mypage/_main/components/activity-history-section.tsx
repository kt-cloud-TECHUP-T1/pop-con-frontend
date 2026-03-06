'use client';

import { type Ref, useState } from 'react';
import { Typography } from '@/components/ui/typography';
import { useTabIndicator } from '@/hooks/use-tab-indicator';
import { cn } from '@/lib/utils';
import {
  activityItems,
  activityTabs,
} from '@/app/(protected)/mypage/_main/data/mock-data';
import type { ActivityTab } from '@/app/(protected)/mypage/_main/types';
import { ActivityHistoryRow } from '@/app/(protected)/mypage/components/activity-history/activity-history-row';
import { ActivityStatusBadge } from '@/app/(protected)/mypage/components/activity-history/activity-status-badge';

export function ActivityHistorySection() {
  const [activeTab, setActiveTab] = useState<ActivityTab>('draw');
  const { indicator, setContainerRef, setItemRef } = useTabIndicator(activeTab);

  return (
    <section>
      <div className="mb-6">
        <Typography variant="heading-1" weight="bold" className="mb-6">
          활동 내역
        </Typography>
        <div
          ref={setContainerRef as Ref<HTMLDivElement>}
          className="relative flex border-b border-black/10"
        >
          {activityTabs.map((tab) => {
            const isActive = tab.value === activeTab;

            return (
              <button
                key={tab.value}
                type="button"
                ref={setItemRef(tab.value) as Ref<HTMLButtonElement>}
                onClick={() => setActiveTab(tab.value)}
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

      <div className="space-y-8">
        {activityItems[activeTab].map((item) => (
          <ActivityHistoryRow
            key={item.id}
            title={item.title}
            price={item.price}
            paidAt={item.paidAt}
            rightContent={
              <ActivityStatusBadge
                label={item.stateLabel}
                tone={item.stateTone}
              />
            }
          />
        ))}
      </div>
    </section>
  );
}
