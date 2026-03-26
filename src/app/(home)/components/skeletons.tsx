const SkeletonBlock = ({ className }: { className: string }) => (
  <div
    className={`animate-pulse rounded-xl bg-[var(--neutral-90)] ${className}`}
  />
);

const SectionTitleSkeleton = () => (
  <div className="flex justify-between items-center mb-6">
    <SkeletonBlock className="h-8 w-36 rounded-xs" />
    <SkeletonBlock className="h-6 w-16 rounded-xs" />
  </div>
);

const CardSkeleton = ({ ratio }: { ratio: '3/4' | '16/9' }) => (
  <div className="animate-pulse">
    <SkeletonBlock
      className={
        ratio === '16/9' ? 'aspect-video w-full' : 'aspect-[384/501] w-full'
      }
    />
    <div className="mt-2 space-y-1.5">
      <SkeletonBlock className="h-4 w-3/4 rounded" />
      <SkeletonBlock className="h-3 w-1/2 rounded" />
    </div>
  </div>
);

/** 메인 배너 */
export const MainBannerSkeleton = () => (
  <div className="flex gap-6 justify-center overflow-hidden">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="w-[384px] shrink-0 animate-pulse">
        <SkeletonBlock className="aspect-[384/501] w-full" />
      </div>
    ))}
  </div>
);

/** 팝업 추천 — 3/4 카드, 2~4열 */
export const RecommendSkeleton = () => (
  <section className="mb-20">
    <SectionTitleSkeleton />
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <CardSkeleton key={i} ratio="3/4" />
      ))}
    </div>
  </section>
);

/** 팝콘 랭킹 — 3/4 카드, 2~5열 */
export const RankingSkeleton = () => (
  <section className="mb-20">
    <SectionTitleSkeleton />
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <CardSkeleton key={i} ratio="3/4" />
      ))}
    </div>
  </section>
);

/** 더치 경매 — 16/9 카드, 1~2열 */
export const DutchAuctionSkeleton = () => (
  <section className="mb-20">
    <SectionTitleSkeleton />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: 2 }).map((_, i) => (
        <CardSkeleton key={i} ratio="16/9" />
      ))}
    </div>
  </section>
);

/** 드로우 — 3/4 카드, 2~4열 */
export const LuckyDrawSkeleton = () => (
  <section className="mb-20">
    <SectionTitleSkeleton />
    <div className="flex gap-2 mb-6">
      <SkeletonBlock className="h-8 w-24 rounded-full" />
      <SkeletonBlock className="h-8 w-20 rounded-full" />
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <CardSkeleton key={i} ratio="3/4" />
      ))}
    </div>
  </section>
);

/** 매거진 — 16/9 카드, 1~4열 */
export const MagazineSkeleton = () => (
  <section className="mb-20">
    <SectionTitleSkeleton />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <CardSkeleton key={i} ratio="16/9" />
      ))}
    </div>
  </section>
);

/** 주목할 만한 팝업 — 3/4 카드, 2~5열 */
export const NotableSkeleton = () => (
  <section className="mb-20">
    <SectionTitleSkeleton />
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <CardSkeleton key={i} ratio="3/4" />
      ))}
    </div>
  </section>
);

/** 곧 종료되는 팝업 — 3/4 카드, 2~5열 */
export const EndingSoonSkeleton = () => (
  <section className="mb-20">
    <SectionTitleSkeleton />
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <CardSkeleton key={i} ratio="3/4" />
      ))}
    </div>
  </section>
);
