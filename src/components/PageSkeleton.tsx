/** Placeholder matching chrome header + cream sheet while a route streams in. */
export function PageSkeleton() {
  return (
    <div className="page-skeleton" role="status" aria-live="polite" aria-label="Loading">
      <div className="page-skeleton__chrome">
        <div className="h-4 w-24 rounded-full bg-on-chrome/20 animate-pulse motion-reduce:animate-none" />
        <div className="mt-4 h-8 w-3/4 rounded-xl bg-on-chrome/25 animate-pulse motion-reduce:animate-none" />
        <div className="mt-2 h-4 w-2/3 rounded-full bg-on-chrome/15 animate-pulse motion-reduce:animate-none" />
      </div>
      <div className="page-skeleton__sheet">
        <div className="flex flex-col gap-4">
          {[0, 1].map((n) => (
            <div key={n} className="card h-36 animate-pulse motion-reduce:animate-none" />
          ))}
        </div>
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
