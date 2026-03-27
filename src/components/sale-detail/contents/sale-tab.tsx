'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

type TabValue = 'info' | 'review';

interface SaleTabProps {
  reviewCount: number;
  hasStickyTopBar: boolean;
}

const TAB_TO_SECTION = {
  info: 'content',
  review: 'review',
} as const;

const STICKY_TOP_BAR_HEIGHT = 40;

export default function SaleTab({
  reviewCount = 0,
  hasStickyTopBar,
}: SaleTabProps) {
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
    const reviewElement = document.getElementById('review');
    if (!reviewElement) return;

    const rootMargin = hasStickyTopBar
      ? `-${STICKY_TOP_BAR_HEIGHT}px 0px 0px 0px`
      : '0px 0px 0px 0px';

    const observer = new IntersectionObserver(
      ([entry]) => {
        setActiveTab((prev) => {
          const nextTab = entry.isIntersecting ? 'review' : 'info';
          return prev === nextTab ? prev : nextTab;
        });
      },
      {
        root: null,
        rootMargin,
        threshold: 0,
      }
    );

    observer.observe(reviewElement);

    return () => {
      observer.disconnect();
    };
  }, [hasStickyTopBar]);

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
              : 'text-gray-400'
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
              : 'text-gray-400'
          )}
        >
          리뷰 {reviewCount}
        </button>
      </div>
    </nav>
  );
}
