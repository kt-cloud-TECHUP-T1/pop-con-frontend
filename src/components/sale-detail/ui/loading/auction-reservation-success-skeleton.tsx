import { Wrapper } from '@/components/layout/wrapper';

interface SkeletonBlockProps {
  className: string;
}

function SkeletonBlock({ className }: SkeletonBlockProps) {
  return <div className={`rounded-md bg-[var(--neutral-90)] ${className}`} />;
}

export function AuctionReservationSuccessSkeleton() {
  return (
    <Wrapper className="py-3xl max-w-[762px]">
      <div className="flex w-full animate-pulse flex-col gap-m">
        <div className="flex flex-col items-center gap-xs">
          <SkeletonBlock className="h-[72px] w-[72px] rounded-full" />
          <SkeletonBlock className="h-9 w-[132px]" />
          <SkeletonBlock className="h-6 w-[260px] max-w-full" />
        </div>

        <div className="flex flex-col gap-xs">
          <div className="flex flex-col gap-ms rounded-ms border border-[var(--line-3)] p-ms">
            <SkeletonBlock className="h-7 w-[92px]" />

            <div>
              <div className="border-b border-[var(--line-3)] pb-s">
                <SkeletonBlock className="h-5 w-[180px]" />
              </div>

              <div className="flex gap-s pt-s">
                <SkeletonBlock className="h-[80px] w-[60px] shrink-0 rounded-[8px]" />

                <div className="flex flex-1 flex-col pt-[2px]">
                  <SkeletonBlock className="mb-[10px] h-6 w-[70%]" />
                  <SkeletonBlock className="h-5 w-[58%]" />
                  <SkeletonBlock className="mt-[6px] h-5 w-[88%]" />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-ms border border-[var(--line-3)] p-ms">
            <SkeletonBlock className="h-7 w-[100px]" />

            <div className="pt-ms">
              <div className="flex items-center justify-between pb-xs">
                <SkeletonBlock className="h-6 w-[68px]" />
                <SkeletonBlock className="h-6 w-[96px]" />
              </div>

              <div className="flex items-center justify-between pb-s">
                <SkeletonBlock className="h-6 w-[84px]" />
                <SkeletonBlock className="h-6 w-[84px]" />
              </div>

              <div className="flex items-center justify-between border-t border-[var(--line-line-1,#E5E5E5)] pt-s">
                <SkeletonBlock className="h-6 w-[120px]" />
                <SkeletonBlock className="h-6 w-[112px]" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-xs">
          <SkeletonBlock className="h-12 flex-1 rounded-[8px]" />
          <SkeletonBlock className="h-12 flex-1 rounded-[8px]" />
        </div>
      </div>
    </Wrapper>
  );
}
