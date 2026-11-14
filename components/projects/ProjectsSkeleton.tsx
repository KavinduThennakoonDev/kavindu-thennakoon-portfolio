export function ProjectsSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading projects from GitHub">
      <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="skeleton aspect-[16/10] rounded-2xl lg:col-span-7" />
        <div className="space-y-4 lg:col-span-5">
          <div className="skeleton h-12 w-20 rounded-lg" />
          <div className="skeleton h-10 w-4/5 rounded-lg" />
          <div className="skeleton h-4 w-full rounded" />
          <div className="skeleton h-4 w-2/3 rounded" />
          <div className="flex gap-2 pt-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="skeleton h-7 w-20 rounded-full" />
            ))}
          </div>
        </div>
      </div>
      <div className="mt-24 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-line">
            <div className="skeleton aspect-[16/9]" />
            <div className="space-y-3 p-5">
              <div className="skeleton h-3 w-24 rounded" />
              <div className="skeleton h-6 w-3/4 rounded" />
              <div className="skeleton h-3 w-full rounded" />
              <div className="skeleton h-3 w-5/6 rounded" />
            </div>
          </div>
        ))}
      </div>
      <span className="sr-only">Loading projects…</span>
    </div>
  );
}
