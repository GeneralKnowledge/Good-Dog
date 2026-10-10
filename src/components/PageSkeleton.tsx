/** Instant placeholder shown while a server-rendered page streams in after a tap. */
export function PageSkeleton() {
  return (
    <div
      className="px-5 pt-6 pb-8"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="h-6 w-28 rounded-full bg-line animate-pulse motion-reduce:animate-none" />
      <div className="mt-5 h-9 w-3/4 rounded-xl bg-line animate-pulse motion-reduce:animate-none" />
      <div className="mt-3 h-4 w-2/3 rounded-full bg-line animate-pulse motion-reduce:animate-none" />
      <div className="mt-8 flex flex-col gap-4">
        {[0, 1].map((n) => (
          <div key={n} className="card h-36 animate-pulse motion-reduce:animate-none" />
        ))}
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
