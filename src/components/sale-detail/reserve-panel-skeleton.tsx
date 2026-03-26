export function ReservePanelSkeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-14">
      {/* 캘린더 스켈레톤 */}
      <div>
        <div className="w-40 h-6 rounded bg-[var(--neutral-90)] mb-6" />
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-6 h-6 rounded bg-[var(--neutral-90)]" />
          <div className="w-20 h-6 rounded bg-[var(--neutral-90)]" />
          <div className="w-6 h-6 rounded bg-[var(--neutral-90)]" />
        </div>
        <div className="grid grid-cols-7 gap-y-s">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="flex min-h-[88px] items-center justify-center">
              <div className="w-[72px] h-[72px] rounded-xl bg-[var(--neutral-90)]" />
            </div>
          ))}
        </div>
      </div>
      {/* 회차 스켈레톤 */}
      <div>
        <div className="w-32 h-6 rounded bg-[var(--neutral-90)] mb-6" />
        <div className="grid grid-cols-2 gap-s md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-[88px] rounded-xl bg-[var(--neutral-90)]" />
          ))}
        </div>
      </div>
    </div>
  );
}