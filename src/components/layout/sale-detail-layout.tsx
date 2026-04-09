import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface SaleDetailLayoutProps {
  left: React.ReactNode;
  right: React.ReactNode;
  className?: string;
  hasStickyTopBar?: boolean;
  bottom?: React.ReactNode;
}

export function SaleDetailLayout({
  left,
  right,
  className,
  hasStickyTopBar = false,
  bottom,
}: SaleDetailLayoutProps) {
  return (
    <>
      <main
        className={cn(
          'grid gap-[54px] lg:grid-cols-[minmax(0,1fr)_384px] ',
          className
        )}
      >
        <section className="min-w-0 ">{left}</section>

        <aside
          className={cn(
            'h-fit lg:sticky',
            // SaleTimeCountBar 유무에 따라 sticky 위치 조정
            // - 있음: bar 높이 기준 (132px)
            // - 없음: 헤더 높이 기준 (82px)
            hasStickyTopBar
              ? 'lg:top-[calc(var(--sale-time-bar-height)+var(--spacing-s))]'
              : 'lg:top-[calc(var(--header-height)+var(--spacing-s))]'
          )}
        >
          {right}
        </aside>
      </main>
      <section className="pt-[64px]">{bottom}</section>
    </>
  );
}
