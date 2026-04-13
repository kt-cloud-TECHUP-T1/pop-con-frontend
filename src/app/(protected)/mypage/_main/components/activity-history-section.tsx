'use client';

import Link from 'next/link';
import {
  type KeyboardEvent,
  type Ref,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Typography } from '@/components/ui/typography';
import { useTabIndicator } from '@/hooks/use-tab-indicator';
import { cn, formatWon } from '@/lib/utils';
import { activityTabs } from '@/app/(protected)/mypage/data/mock-data';
import type {
  ActivityItem,
  ActivityStatusTone,
  ActivityTab,
} from '@/app/(protected)/mypage/types';
import { ActivityHistoryList } from '@/app/(protected)/mypage/components/activity-history/activity-history-list';
import { ActivityStatusBadge } from '@/app/(protected)/mypage/components/activity-history/activity-status-badge';
import { PageHeader } from '@/components/shared/page-header';
import { Box } from '@/components/ui/box';
import { Icon } from '@/components/Icon/Icon';
import DrawResultModal, {
  type DrawResult,
} from '@/app/(protected)/mypage/activity/draws/components/draw-result-modal';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import type { ApiResponse } from '@/types/api/common';

interface DrawHistoryItem {
  id: number;
  thumbnailUrl: string | null;
  popupTitle: string;
  entryFee: number;
  appliedAt: string;
  status: string;
}

interface BidHistoryItem {
  id: number;
  thumbnailUrl: string | null;
  popupTitle: string;
  bidPrice: number;
  paidAt: string;
  displayStatus: string;
}

const PREVIEW_COUNT = 3;

function formatDate(isoString: string) {
  const date = new Date(isoString);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
}

type DrawStatusFilter = 'won' | 'notWon' | 'inProgress' | 'pendingResult';

function getDrawStatusFilter(status: string): DrawStatusFilter {
  const s = status.toUpperCase();
  if (s === 'WON' || s === '당첨') return 'won';
  if (s === 'LOST' || s === '미당첨') return 'notWon';
  if (s === 'IN_PROGRESS' || s === '진행중') return 'inProgress';
  return 'pendingResult';
}

function getDrawStatusLabel(status: string): string {
  const filterMap: Record<DrawStatusFilter, string> = {
    won: '드로우 당첨',
    notWon: '드로우 미당첨',
    inProgress: '드로우 진행중',
    pendingResult: '결과 확인 대기중',
  };
  return filterMap[getDrawStatusFilter(status)];
}

function getDrawStatusTone(status: string): ActivityStatusTone {
  const toneMap: Record<DrawStatusFilter, ActivityStatusTone> = {
    won: 'success',
    notWon: 'danger',
    inProgress: 'neutral',
    pendingResult: 'warning',
  };
  return toneMap[getDrawStatusFilter(status)];
}

function ItemSkeleton() {
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

export function ActivityHistorySection() {
  const [activeTab, setActiveTab] = useState<ActivityTab>('draw');
  const [modalResult, setModalResult] = useState<DrawResult | null>(null);
  const [draws, setDraws] = useState<DrawHistoryItem[] | null>(null);
  const [bids, setBids] = useState<BidHistoryItem[] | null>(null);
  const [drawsError, setDrawsError] = useState(false);
  const [bidsError, setBidsError] = useState(false);
  const { indicator, setContainerRef, setItemRef } = useTabIndicator(activeTab);
  const tabButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const accessToken = useAuthStore((state) => state.accessToken);

  const getTabId = (tab: ActivityTab) => `activity-history-tab-${tab}`;
  const getPanelId = (tab: ActivityTab) => `activity-history-panel-${tab}`;

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
          setDrawsError(true);
          return;
        }
        const result = (await response.json()) as ApiResponse<
          DrawHistoryItem[]
        >;
        setDraws(result.data ?? []);
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError')
          return;
        setDrawsError(true);
      }
    };

    const fetchBids = async () => {
      try {
        const response = await fetch('/api/history/bids', {
          signal: controller.signal,
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!response.ok) {
          setBidsError(true);
          return;
        }
        const result = (await response.json()) as ApiResponse<BidHistoryItem[]>;
        setBids(result.data ?? []);
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError')
          return;
        setBidsError(true);
      }
    };

    void fetchDraws();
    void fetchBids();
    return () => controller.abort();
  }, [accessToken]);

  const drawItems: ActivityItem[] = (draws ?? [])
    .slice(0, PREVIEW_COUNT)
    .map((item) => ({
      id: item.id,
      title: item.popupTitle,
      price: formatWon(item.entryFee),
      paidAt: formatDate(item.appliedAt),
      stateLabel: getDrawStatusLabel(item.status),
      stateTone: getDrawStatusTone(item.status),
      isResultPending: getDrawStatusFilter(item.status) === 'pendingResult',
    }));

  const bidItems: ActivityItem[] = (bids ?? [])
    .slice(0, PREVIEW_COUNT)
    .map((item) => ({
      id: item.id,
      title: item.popupTitle,
      price: formatWon(item.bidPrice),
      paidAt: formatDate(item.paidAt),
      stateLabel: item.displayStatus,
      stateTone:
        item.displayStatus === '환불됨' || item.displayStatus === 'REFUNDED'
          ? 'danger'
          : 'success',
    }));

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
  const isLoading = isDrawTab ? draws === null : bids === null;
  const isError = isDrawTab ? drawsError : bidsError;
  const items = isDrawTab ? drawItems : bidItems;
  const totalCount = isDrawTab ? (draws?.length ?? 0) : (bids?.length ?? 0);
  const moreHref = isDrawTab
    ? '/mypage/activity/draws'
    : '/mypage/activity/bids';

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
                <ItemSkeleton />
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
              renderRightContent={(item) =>
                item.isResultPending ? (
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
                )
              }
            />
            {totalCount > PREVIEW_COUNT && (
              <div className="mt-6 text-center">
                <Link
                  href={moreHref}
                  className="text-[var(--neutral-40)] text-sm underline underline-offset-4 hover:text-[var(--neutral-20)] transition-colors"
                >
                  더보기 ({totalCount}개 전체)
                </Link>
              </div>
            )}
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
