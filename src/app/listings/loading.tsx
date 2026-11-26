import ListingsSkeletonGrid from "./ListingsSkeletonGrid";

export default function ListingsLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-44 animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-56 animate-pulse rounded bg-slate-200" />
        </div>
        <div className="h-10 w-32 animate-pulse rounded-xl bg-[#0d7369]/20" />
      </div>
      <div className="mb-6 h-20 w-full animate-pulse rounded-2xl border border-slate-200/90 bg-white" />
      <ListingsSkeletonGrid />
    </div>
  );
}
