import Link from 'next/link';
import { ACTIVITY_TABS } from '@/app/(protected)/mypage/_config/mypage';
import { cn } from '@/lib/utils';
import type { ActivityTabValue } from '@/types/mypage';

type ActivityTabsProps = {
  currentTab: ActivityTabValue;
};

export function ActivityTabs({ currentTab }: ActivityTabsProps) {
  return (
    <nav className="flex flex-wrap gap-2" aria-label="활동 내역 탭">
      {ACTIVITY_TABS.map((tab) => {
        const isActive = currentTab === tab.value;

        return (
          <Link
            key={tab.value}
            href={`/mypage/activity?tab=${tab.value}`}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'rounded-full border px-4 py-2 transition-colors',
              isActive
                ? 'border-[var(--neutral-10)] text-[var(--neutral-10)]'
                : 'border-[var(--neutral-80)] text-[var(--neutral-60)]'
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
