export function SkeletonCard() {
  return (
    <div className="rounded-3xl bg-card shadow-soft overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-muted" />
      <div className="p-6 space-y-3">
        <div className="h-5 w-3/4 rounded bg-muted" />
        <div className="h-3 w-full rounded bg-muted" />
        <div className="h-3 w-2/3 rounded bg-muted" />
        <div className="flex gap-2 pt-1">
          <div className="h-5 w-12 rounded-full bg-muted" />
          <div className="h-5 w-14 rounded-full bg-muted" />
        </div>
      </div>
    </div>
  );
}
