const CARD_COUNT = 8;
const PREVIEW_COUNT = 3;

export function ProfileSummarySectionSkeleton() {
  return (
    <section className="space-y-2 animate-pulse">
      {/* 프로필 카드 */}
      <div className="rounded-ml border border-[#0A0A0A14] p-6 mb-[80px]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="h-[72px] w-[72px] rounded-full bg-[var(--neutral-90)]" />
            <div className="space-y-2">
              <div className="h-6 w-full max-w-[500px] rounded bg-[var(--neutral-90)]" />
              <div className="h-4 w-32 rounded bg-[var(--neutral-90)]" />
            </div>
          </div>
          <div className="h-6 w-16 rounded bg-[var(--neutral-90)]" />
        </div>
      </div>

      {/* 요약 카드 4개 */}
      <div className="grid gap-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-ml h-32 border border-[#0A0A0A14] p-6 bg-[var(--neutral-90)]"
          ></div>
        ))}
      </div>

      {/* 통계 6개 */}
      <div className="rounded-ml border border-[var(--component-disabled)] p-4 grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="p-2 py-6 text-right space-y-1 flex flex-col justify-center"
          >
            <div className="h-4 w-20 rounded bg-[var(--neutral-90)] ml-auto" />
            <div className="h-5 w-8 rounded bg-[var(--neutral-90)] ml-auto" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function LikedPopupCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] rounded-[var(--radius-ML)] bg-[var(--neutral-90)] border-[var(--line-3)] rounded-ml" />
      <div className="mt-4 space-y-2">
        <div className="h-6 w-3/4 rounded bg-[var(--neutral-90)]" />
        <div className="h-6 w-1/2 rounded bg-[var(--neutral-90)]" />
        <div className="h-5 w-1/3 rounded bg-[var(--neutral-90)]" />
      </div>
    </div>
  );
}

export function LikedPopupsSectionSkeleton() {
  return (
    <section>
      {/* 헤더 */}
      <div className="mb-6 flex items-center justify-between gap-4 animate-pulse">
        <div className="h-7 w-36 rounded bg-[var(--neutral-90)]" />
        <div className="h-4 w-12 rounded bg-[var(--neutral-90)]" />
      </div>

      {/* 카드 그리드 */}
      <div className="grid grid-cols-1 gap-x-2 gap-y-6 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: CARD_COUNT }).map((_, i) => (
          <LikedPopupCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}

export function ActivityItemSkeleton() {
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

export function ActivityHistorySectionSkeleton() {
  return (
    <section>
      <div className="mb-6 animate-pulse">
        {/* 타이틀 */}
        <div className="h-7 w-24 rounded bg-[var(--neutral-90)] mb-3" />
        {/* 탭 바 */}
        <div className="flex gap-4 border-b border-black/10">
          <div className="h-10 w-16 rounded bg-[var(--neutral-90)]" />
          <div className="h-10 w-16 rounded bg-[var(--neutral-90)]" />
        </div>
      </div>

      <ul className="space-y-8">
        {Array.from({ length: PREVIEW_COUNT }).map((_, i) => (
          <li key={i}>
            <ActivityItemSkeleton />
          </li>
        ))}
      </ul>
    </section>
  );
}
