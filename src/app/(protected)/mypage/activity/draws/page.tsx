'use client';

import { useMemo, useState } from 'react';
import { MyPageHeader } from '@/app/(protected)/mypage/components/page-header';
import { ActivityStatusBadge } from '@/app/(protected)/mypage/components/activity-history/activity-status-badge';
import { ActivityHistoryRow } from '@/app/(protected)/mypage/components/activity-history/activity-history-row';
import { ActivityStatusFilters } from '@/app/(protected)/mypage/components/activity-history/activity-status-filters';
import type { ActivityStatusTone } from '@/app/(protected)/mypage/components/activity-history/types';
import { formatWon } from '@/lib/utils';

type DrawStatusFilter =
  | 'all'
  | 'won'
  | 'notWon'
  | 'inProgress'
  | 'pendingResult';

type DrawHistoryItem = {
  id: number;
  title: string;
  amount: number;
  paidAt: string;
  statusFilter: Exclude<DrawStatusFilter, 'all'>;
  statusLabel: string;
  statusTone: ActivityStatusTone;
};

const drawStatusFilters: { value: DrawStatusFilter; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'won', label: '드로우 당첨' },
  { value: 'notWon', label: '드로우 미당첨' },
  { value: 'inProgress', label: '드로우 진행중' },
  { value: 'pendingResult', label: '결과 확인 대기중' },
];

const drawHistory: DrawHistoryItem[] = [
  {
    id: 1,
    title: 'Title',
    amount: 31000,
    paidAt: '2026.02.17',
    statusFilter: 'won',
    statusLabel: '드로우 당첨',
    statusTone: 'success',
  },
  {
    id: 2,
    title: 'Title',
    amount: 14000,
    paidAt: '2026.02.14',
    statusFilter: 'notWon',
    statusLabel: '드로우 미당첨',
    statusTone: 'danger',
  },
  {
    id: 3,
    title: 'Title',
    amount: 18000,
    paidAt: '2026.02.11',
    statusFilter: 'pendingResult',
    statusLabel: '결과 확인 대기중',
    statusTone: 'warning',
  },
  {
    id: 4,
    title: 'Title',
    amount: 26000,
    paidAt: '2026.02.08',
    statusFilter: 'inProgress',
    statusLabel: '드로우 진행중',
    statusTone: 'neutral',
  },
];

export default function MyPageActivityDrawsPage() {
  const [activeFilter, setActiveFilter] = useState<DrawStatusFilter>('all');
  const filteredDrawHistory = useMemo(
    () =>
      activeFilter === 'all'
        ? drawHistory
        : drawHistory.filter((item) => item.statusFilter === activeFilter),
    [activeFilter]
  );

  return (
    <section className="max-w-[920px]">
      <MyPageHeader
        title="드로우 응모 내역"
        titleVariant="heading-1"
        titleWeight="bold"
      />
      <ActivityStatusFilters
        options={drawStatusFilters}
        activeValue={activeFilter}
        onChange={setActiveFilter}
      />
      <ul className="space-y-8">
        {filteredDrawHistory.map((item) => (
          <li key={item.id}>
            <ActivityHistoryRow
              title={item.title}
              price={formatWon(item.amount)}
              paidAt={item.paidAt}
              rightContent={
                <ActivityStatusBadge
                  label={item.statusLabel}
                  tone={item.statusTone}
                />
              }
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
