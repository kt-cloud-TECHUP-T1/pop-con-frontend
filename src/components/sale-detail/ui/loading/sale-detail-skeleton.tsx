import { Wrapper } from '@/components/layout/wrapper';

interface SkeletonBlockProps {
  className: string;
}

function SkeletonBlock({ className }: SkeletonBlockProps) {
  return <div className={`rounded-md bg-[var(--neutral-90)] ${className}`} />;
}

export function SaleDetailSkeleton() {
  return (
    <Wrapper className="pt-m pb-3xl">
      <div className="animate-pulse">
        <div className="grid gap-[54px] lg:grid-cols-[minmax(0,1fr)_384px]">
          <section className="min-w-0">
            <div className="flex flex-col">
              <SkeletonBlock className="aspect-[4/5] w-full rounded-ml" />

              <div className="border-b border-[var(--line-2)] px-s py-[28px]">
                <SkeletonBlock className="mb-3 h-5 w-24" />
                <SkeletonBlock className="mb-4 h-9 w-3/4" />
                <div className="flex gap-2">
                  <SkeletonBlock className="h-6 w-20 rounded-full" />
                  <SkeletonBlock className="h-6 w-24 rounded-full" />
                </div>
              </div>

              <div className="sticky top-0 z-10 flex gap-6 border-b border-[var(--line-2)] bg-[var(--background)] px-s py-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <SkeletonBlock key={index} className="h-6 w-16" />
                ))}
              </div>

              <div className="flex flex-col gap-10 px-s py-8">
                <div>
                  <SkeletonBlock className="mb-4 h-7 w-32" />
                  <SkeletonBlock className="mb-3 h-5 w-full" />
                  <SkeletonBlock className="mb-3 h-5 w-[92%]" />
                  <SkeletonBlock className="h-5 w-[78%]" />
                </div>

                <div>
                  <SkeletonBlock className="mb-4 h-7 w-28" />
                  <div className="grid grid-cols-2 gap-s">
                    <SkeletonBlock className="aspect-square w-full rounded-xl" />
                    <SkeletonBlock className="aspect-square w-full rounded-xl" />
                  </div>
                </div>

                <div>
                  <SkeletonBlock className="mb-4 h-7 w-24" />
                  <SkeletonBlock className="h-[320px] w-full rounded-ml" />
                </div>

                <div>
                  <SkeletonBlock className="mb-4 h-7 w-28" />
                  <div className="space-y-3">
                    <SkeletonBlock className="h-24 w-full rounded-xl" />
                    <SkeletonBlock className="h-24 w-full rounded-xl" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <aside className="h-fit">
            <div className="flex flex-col gap-s">
              <div className="rounded-ml border border-[var(--line-3)] p-ms">
                <SkeletonBlock className="mb-4 h-6 w-28" />
                <SkeletonBlock className="mb-3 h-10 w-full rounded-xl" />
                <SkeletonBlock className="mb-6 h-10 w-full rounded-xl" />
                <SkeletonBlock className="h-12 w-full rounded-xl" />
              </div>

              <div className="rounded-ml border border-[var(--line-3)] p-ms">
                <SkeletonBlock className="mb-4 h-6 w-24" />
                <div className="space-y-3">
                  <SkeletonBlock className="h-5 w-full" />
                  <SkeletonBlock className="h-5 w-[88%]" />
                  <SkeletonBlock className="h-5 w-[72%]" />
                </div>
              </div>
            </div>
          </aside>
        </div>

        <section className="pt-[64px]">
          <div className="space-y-10">
            <div>
              <SkeletonBlock className="mb-5 h-8 w-40" />
              <div className="grid gap-s md:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <SkeletonBlock
                    key={index}
                    className="h-[220px] w-full rounded-ml"
                  />
                ))}
              </div>
            </div>

            <div>
              <SkeletonBlock className="mb-5 h-8 w-40" />
              <div className="grid gap-s md:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <SkeletonBlock
                    key={index}
                    className="h-[220px] w-full rounded-ml"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </Wrapper>
  );
}
