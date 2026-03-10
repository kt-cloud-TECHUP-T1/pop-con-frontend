import { useMemo, useState } from 'react';
import {
  drawStatusFilters,
  initialDrawHistory,
} from '@/features/mypage/draws/data/mock-draw-history';
import type {
  DrawHistoryItem,
  DrawStatusFilter,
} from '@/features/mypage/draws/types';

export function useDrawHistoryFilter() {
  const [drawHistory, setDrawHistory] =
    useState<DrawHistoryItem[]>(initialDrawHistory);
  const [activeFilters, setActiveFilters] = useState<DrawStatusFilter[]>(
    drawStatusFilters.map((filter) => filter.value)
  );

  const toggleActiveFilter = (value: DrawStatusFilter) => {
    setActiveFilters((prev) =>
      prev.includes(value)
        ? prev.filter((selectedValue) => selectedValue !== value)
        : [...prev, value]
    );
  };

  const filteredDrawHistory = useMemo(
    () =>
      activeFilters.length === 0
        ? drawHistory
        : drawHistory.filter((item) =>
            activeFilters.includes(item.statusFilter)
          ),
    [activeFilters, drawHistory]
  );

  return {
    drawHistory,
    setDrawHistory,
    activeFilters,
    toggleActiveFilter,
    filteredDrawHistory,
  };
}
