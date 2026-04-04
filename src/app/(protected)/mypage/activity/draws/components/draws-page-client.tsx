'use client';

import { useState } from 'react';
import { ActivityStatusBadge } from '@/app/(protected)/mypage/components/activity-history/activity-status-badge';
import { ActivityHistoryList } from '@/app/(protected)/mypage/components/activity-history/activity-history-list';
import { ActivityStatusFilters } from '@/app/(protected)/mypage/components/activity-history/activity-status-filters';
import { formatWon } from '@/lib/utils';
import { Box } from '@/components/ui/box';
import { Typography } from '@/components/ui/typography';
import { Icon } from '@/components/Icon/Icon';
import type { ActivityItem } from '@/app/(protected)/mypage/types';
import DrawResultModal, { type DrawResult } from './draw-result-modal';

type DrawStatusFilter = 'won' | 'notWon' | 'inProgress' | 'pendingResult';

type DrawHistoryItem = {
  id: number;
  title: string;
  amount: number;
  paidAt: string;
  statusFilter: DrawStatusFilter;
  statusLabel: string;
  statusTone: 'neutral' | 'warning' | 'danger' | 'success';
  drawResult?: 'lucky' | 'won' | 'notWon';
};

const STATUS_FILTERS: { value: DrawStatusFilter; label: string }[] = [
  { value: 'won', label: '드로우 당첨' },
  { value: 'notWon', label: '드로우 미당첨' },
  { value: 'inProgress', label: '드로우 진행중' },
  { value: 'pendingResult', label: '결과 확인 대기중' },
];

// TODO: 실제 API로 교체 필요
const DRAW_HISTORY: DrawHistoryItem[] = [
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
    amount: 26000,
    paidAt: '2026.02.08',
    statusFilter: 'inProgress',
    statusLabel: '드로우 진행중',
    statusTone: 'neutral',
  },
  {
    id: 4,
    title: 'Title',
    amount: 18000,
    paidAt: '2026.02.11',
    statusFilter: 'pendingResult',
    statusLabel: '결과 확인 대기중',
    statusTone: 'warning',
    drawResult: 'lucky',
  },
  {
    id: 5,
    title: 'Title',
    amount: 12000,
    paidAt: '2026.02.12',
    statusFilter: 'pendingResult',
    statusLabel: '결과 확인 대기중',
    statusTone: 'warning',
    drawResult: 'won',
  },
  {
    id: 6,
    title: 'Title',
    amount: 10000,
    paidAt: '2026.02.14',
    statusFilter: 'pendingResult',
    statusLabel: '결과 확인 대기중',
    statusTone: 'warning',
    drawResult: 'notWon',
  },
];

export function DrawsPageClient() {
  const [activeFilter, setActiveFilter] = useState<DrawStatusFilter | null>(
    null
  );
  const [modalResult, setModalResult] = useState<DrawResult | null>(null);

  const handleToggle = (value: DrawStatusFilter) => {
    setActiveFilter((prev) => (prev === value ? null : value));
  };

  const filteredHistory = activeFilter
    ? DRAW_HISTORY.filter((item) => item.statusFilter === activeFilter)
    : DRAW_HISTORY;

  const items: ActivityItem[] = filteredHistory.map((item) => ({
    id: item.id,
    title: item.title,
    price: formatWon(item.amount),
    paidAt: item.paidAt,
    stateLabel: item.statusLabel,
    stateTone: item.statusTone,
  }));

  return (
    <section>
      <ActivityStatusFilters
        options={STATUS_FILTERS}
        activeValues={activeFilter ? [activeFilter] : []}
        onToggle={handleToggle}
      />
      <ActivityHistoryList
        items={items}
        renderRightContent={(item) => {
          const draw = filteredHistory.find((d) => d.id === item.id)!;
          return draw.statusFilter === 'pendingResult' ? (
            <Box
              as="button"
              type="button"
              paddingX="S"
              radius="XS"
              className="bg-[var(--orange-50)] py-2 text-white flex gap-1"
              onClick={() => setModalResult(draw.drawResult ?? 'notWon')}
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
