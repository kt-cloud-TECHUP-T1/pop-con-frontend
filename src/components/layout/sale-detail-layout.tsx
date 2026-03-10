import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface SaleDetailLayoutProps {
  left: React.ReactNode;
  right: React.ReactNode;
  className?: string;
}

export function SaleDetailLayout({
  left,
  right,
  className,
}: SaleDetailLayoutProps) {
  return (
    <main
      className={cn(
        'grid gap-[54px] lg:grid-cols-[minmax(0,1fr)_384px] ',
        className
      )}
    >
      <section className="min-w-0 ">{left}</section>

      <aside className="h-fit lg:sticky lg:top-xl ">{right}</aside>
    </main>
  );
}
