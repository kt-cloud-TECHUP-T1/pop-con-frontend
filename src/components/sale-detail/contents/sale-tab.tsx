'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

type TabValue = 'info' | 'review';

const SECTION_TO_TAB = {
  content: 'info',
  map: 'info',
  review: 'review',
} as const;

export default function SaleTab() {
  const [activeTab, setActiveTab] = useState<TabValue>('info');

  const handleTabClick = (tab: TabValue) => {
    setActiveTab(tab);
    const targetId = tab === 'info' ? 'content' : 'review';
    const targetElement = document.getElementById(targetId);

    if (!targetElement) return;

    targetElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  useEffect(() => {
    const sectionIds = ['content', 'map', 'review'];

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);

        if (!visibleEntry) return;

        const sectionId = visibleEntry.target.id as keyof typeof SECTION_TO_TAB;
        const nextTab = SECTION_TO_TAB[sectionId];

        setActiveTab(nextTab);
      },
      {
        threshold: 0.3,
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
