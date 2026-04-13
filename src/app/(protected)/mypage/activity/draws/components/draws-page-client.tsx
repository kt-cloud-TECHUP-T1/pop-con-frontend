'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import { ActivityStatusBadge } from '@/app/(protected)/mypage/components/activity-history/activity-status-badge';
import { ActivityHistoryList } from '@/app/(protected)/mypage/components/activity-history/activity-history-list';
import { ActivityStatusFilters } from '@/app/(protected)/mypage/components/activity-history/activity-status-filters';
import { formatWon } from '@/lib/utils';
import { Box } from '@/components/ui/box';
import { Typography } from '@/components/ui/typography';
import { Icon } from '@/components/Icon/Icon';
import type { ApiResponse } from '@/types/api/common';
import type { ActivityItem, ActivityStatusTone } from '@/app/(protected)/mypage/types';
import DrawResultModal, { type DrawResult } from './draw-result-modal';

type DrawStatusFilter = 'won' | 'notWon' | 'inProgress' | 'pendingResult';

interface DrawHistoryItem {
  id: number;
  thumbnailUrl: string | null;
  popupTitle: string;
  entryFee: number;
  appliedAt: string;
  status: string;
}

const STATUS_FILTERS: { value: DrawStatusFilter; label: string }[] = [
  { value: 'won', label: '드로우 당첨' },
  { value: 'notWon', label: '드로우 미당첨' },
  { value: 'inProgress', label: '드로우 진행중' },
  { value: 'pendingResult', label: '결과 확인 대기중' },
];

function formatDate(isoString: string) {
  const date = new Date(isoString);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
}

function getStatusFilter(status: string): DrawStatusFilter {
  const s = status.toUpperCase();
  if (s === 'WON' || s === '당첨') return 'won';
  if (s === 'LOST' || s === '미당첨') return 'notWon';
  if (s === 'IN_PROGRESS' || s === '진행중') return 'inProgress';
  return 'pendingResult';
}

function getStatusLabel(status: string): string {
  const filter = getStatusFilter(status);
  return STATUS_FILTERS.find((f) => f.value === filter)?.label ?? status;
}

function getStatusTone(status: string): ActivityStatusTone {
  const filter = getStatusFilter(status);
  const toneMap: Record<DrawStatusFilter, ActivityStatusTone> = {
    won: 'success',
    notWon: 'danger',
    inProgress: 'neutral',
    pendingResult: 'warning',
  };
  return toneMap[filter];
}

function DrawItemSkeleton() {
  return (
    <div className="animate-pulse grid grid-cols-1 gap-4 py-2 md:grid-cols-[80px_minmax(0,1fr)_160px_140px_160px] md:items-center md:gap-6">
      <div className="w-20 h-[104px] rounded-[var(--radius-ML)] bg-[var(--neutral-90)]" />
      <div className="h-5 w-2/3 rounded bg-[var(--neutral-90)]" />
      <div className="h-5 w-24 rounded bg-[var(--neutral-90)]" />
      <div className="space-y-1.5">
        <div className="h-4 w-20 rounded bg-[var(--neutral-90)]" />
        <div className="h-3 w-16 rounded bg-[var(--neutral-90)]" />
      </div>
      <div className="h-9 w-[100px] rounded bg-[var(--neutral-90)] md:justify-self-end" />
    </div>
  );
}

export function DrawsPageClient() {
  const [draws, setDraws] = useState<DrawHistoryItem[] | null>(null);
  const [isError, setIsError] = useState(false);
  const [activeFilter, setActiveFilter] = useState<DrawStatusFilter | null>(null);
  const [modalResult, setModalResult] = useState<DrawResult | null>(null);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (!accessToken) return;

    const controller = new AbortController();

    const fetchDraws = async () => {
      try {
        const response = await fetch('/api/history/draws', {
          signal: controller.signal,
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!response.ok) {
          setIsError(true);
          return;
        }

        const result = (await response.json()) as ApiResponse<DrawHistoryItem[]>;
        setDraws(result.data ?? []);
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setIsError(true);
      }
    };

    fetchDraws();
    return () => controller.abort();
  }, [accessToken]);

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

  if (draws === null) {
    return (
      <ul className="space-y-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <li key={i}>
            <DrawItemSkeleton />
          </li>
        ))}
      </ul>
    );
  }

  const filteredDraws = activeFilter
    ? draws.filter((item) => getStatusFilter(item.status) === activeFilter)
    : draws;

  const items: ActivityItem[] = filteredDraws.map((item) => ({
    id: item.id,
    title: item.popupTitle,
    price: formatWon(item.entryFee),
    paidAt: formatDate(item.appliedAt),
    stateLabel: getStatusLabel(item.status),
    stateTone: getStatusTone(item.status),
  }));

  return (
    <section>
      <ActivityStatusFilters
        options={STATUS_FILTERS}
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
            const filter = getStatusFilter(draw.status);

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
