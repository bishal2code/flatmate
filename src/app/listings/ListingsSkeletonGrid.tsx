export default function ListingsSkeletonGrid() {
  return (
    <div
      aria-label="Loading listings"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs"
        >
          <div className="aspect-[16/10] w-full animate-pulse bg-slate-200/70" />
          <div className="space-y-3 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <div className="h-5 w-2/3 animate-pulse rounded bg-slate-200" />
              <div className="h-5 w-16 animate-pulse rounded-full bg-[#e8f5f2]" />
            </div>
            <div className="h-3.5 w-1/2 animate-pulse rounded bg-slate-200" />
            <div className="h-6 w-28 animate-pulse rounded-md bg-slate-100" />
            <div className="h-10 w-full animate-pulse rounded-xl bg-[#0d7369]/20" />
          </div>
        </div>
      ))}
    </div>
  );
}
