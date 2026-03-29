"use client";

export default function LoadingSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      {/* Hero skeleton */}
      <div className="skeleton h-[280px] md:h-[340px] rounded-2xl" />

      {/* Trending bar skeleton */}
      <div className="space-y-3">
        <div className="skeleton h-4 w-20" />
        <div className="flex gap-2.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton h-12 w-56 rounded-xl shrink-0" />
          ))}
        </div>
      </div>

      {/* Important section skeleton */}
      <div className="space-y-4">
        <div className="skeleton h-5 w-40" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex rounded-xl border border-[var(--color-border)] overflow-hidden h-44">
              <div className="skeleton w-2/5 h-full rounded-none" />
              <div className="flex-1 p-4 space-y-2">
                <div className="skeleton h-3 w-16" />
                <div className="skeleton h-5 w-full" />
                <div className="skeleton h-5 w-3/4" />
                <div className="skeleton h-4 w-full" />
                <div className="skeleton h-3 w-24 mt-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compact list skeleton */}
      <div className="space-y-3">
        <div className="skeleton h-5 w-32" />
        <div className="rounded-xl border border-[var(--color-border)] overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-3 border-b border-[var(--color-border-light)]">
              <div className="skeleton w-2 h-2 rounded-full" />
              <div className="flex-1 space-y-1">
                <div className="skeleton h-4 w-full" />
                <div className="skeleton h-3 w-24" />
              </div>
              <div className="skeleton h-5 w-8" />
              <div className="skeleton h-3 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
