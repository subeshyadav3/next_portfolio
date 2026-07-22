export default function BlogLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="h-4 w-48 rounded bg-[var(--blog-border)]" />
      {/* Header skeleton */}
      <div className="mt-8 space-y-4">
        <div className="h-6 w-20 rounded-full bg-[var(--blog-border)]" />
        <div className="h-10 w-96 rounded bg-[var(--blog-border)]" />
        <div className="h-5 w-[600px] rounded bg-[var(--blog-border)]" />
      </div>
      {/* Grid skeleton */}
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-[var(--blog-border)] bg-[var(--blog-surface)] overflow-hidden"
          >
            <div className="aspect-[16/10] bg-[var(--blog-border)]" />
            <div className="p-5 space-y-3">
              <div className="h-3 w-16 rounded bg-[var(--blog-border)]" />
              <div className="h-5 w-full rounded bg-[var(--blog-border)]" />
              <div className="h-5 w-3/4 rounded bg-[var(--blog-border)]" />
              <div className="h-4 w-full rounded bg-[var(--blog-border)]" />
              <div className="flex gap-4">
                <div className="h-3 w-20 rounded bg-[var(--blog-border)]" />
                <div className="h-3 w-16 rounded bg-[var(--blog-border)]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
