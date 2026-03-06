'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

type TabValue = 'info' | 'review';

const SECTION_TO_TAB = {
  content: 'info',
  map: 'info',
  review: 'review',
} as const;

const TAB_TO_SECTION = {
  info: 'content',
  review: 'review',
} as const;

const OBSERVE_SECTION_IDS = ['content', 'map', 'review'] as const;
const TAB_CHANGE_THRESHOLD = 0.3;

export default function SaleTab() {
  const [activeTab, setActiveTab] = useState<TabValue>('info');

  const handleTabClick = (tab: TabValue) => {
    setActiveTab(tab);
    const targetId = TAB_TO_SECTION[tab];
    const targetElement = document.getElementById(targetId);

    if (!targetElement) return;

    targetElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  useEffect(() => {
    const sectionIds = OBSERVE_SECTION_IDS;

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);

        if (visibleEntries.length === 0) return;

        const mostVisible = visibleEntries.reduce((prev, current) =>
          prev.intersectionRatio > current.intersectionRatio ? prev : current
        );

        const sectionId = mostVisible.target.id as keyof typeof SECTION_TO_TAB;
        const nextTab = SECTION_TO_TAB[sectionId];

        setActiveTab((prev) => (prev === nextTab ? prev : nextTab));
      },
      {
        threshold: TAB_CHANGE_THRESHOLD,
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <nav aria-label="상품 상세 탭" className="w-full border-b border-gray-200">
      <div className="flex">
        <button
          type="button"
          onClick={() => handleTabClick('info')}
          className={cn(
            'flex-1 py-4 text-sm font-medium',
            activeTab === 'info'
              ? 'border-b-2 border-black text-black'
              : ' text-gray-400'
          )}
        >
          정보
        </button>
        <button
          type="button"
          onClick={() => handleTabClick('review')}
          className={cn(
            'flex-1 py-4 text-sm font-medium',
            activeTab === 'review'
              ? 'border-b-2 border-black text-black'
              : ' text-gray-400'
          )}
        >
          리뷰
        </button>
      </div>
    </nav>
  );
}
