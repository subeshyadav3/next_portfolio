export default function BlogPostLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="h-4 w-48 rounded bg-[var(--blog-border)]" />

      <div className="mx-auto max-w-3xl pt-8 pb-12 text-center">
        {/* Category badge */}
        <div className="mx-auto h-6 w-20 rounded-full bg-[var(--blog-border)]" />
        {/* Title */}
        <div className="mx-auto mt-6 h-10 w-full max-w-xl rounded bg-[var(--blog-border)]" />
        <div className="mx-auto mt-3 h-10 w-3/4 rounded bg-[var(--blog-border)]" />
        {/* Description */}
        <div className="mx-auto mt-4 h-5 w-full max-w-lg rounded bg-[var(--blog-border)]" />
        {/* Meta */}
        <div className="mx-auto mt-6 flex items-center justify-center gap-4">
          <div className="h-4 w-24 rounded bg-[var(--blog-border)]" />
          <div className="h-4 w-4 rounded bg-[var(--blog-border)]" />
          <div className="h-4 w-20 rounded bg-[var(--blog-border)]" />
          <div className="h-4 w-4 rounded bg-[var(--blog-border)]" />
          <div className="h-4 w-16 rounded bg-[var(--blog-border)]" />
        </div>
      </div>

      {/* Hero image */}
      <div className="mx-auto mb-12 max-w-4xl aspect-[16/9] rounded-2xl bg-[var(--blog-border)]" />

      {/* Content skeleton */}
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12">
          <div className="space-y-4">
            <div className="h-5 w-full rounded bg-[var(--blog-border)]" />
            <div className="h-5 w-full rounded bg-[var(--blog-border)]" />
            <div className="h-5 w-3/4 rounded bg-[var(--blog-border)]" />
            <div className="mt-8 h-6 w-1/3 rounded bg-[var(--blog-border)]" />
            <div className="h-5 w-full rounded bg-[var(--blog-border)]" />
            <div className="h-5 w-5/6 rounded bg-[var(--blog-border)]" />
            <div className="h-5 w-full rounded bg-[var(--blog-border)]" />
            <div className="mt-8 h-6 w-1/3 rounded bg-[var(--blog-border)]" />
            <div className="h-5 w-full rounded bg-[var(--blog-border)]" />
            <div className="h-5 w-4/5 rounded bg-[var(--blog-border)]" />
            <div className="h-5 w-2/3 rounded bg-[var(--blog-border)]" />
          </div>
          {/* TOC sidebar skeleton */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-3">
              <div className="h-5 w-28 rounded bg-[var(--blog-border)]" />
              <div className="h-4 w-full rounded bg-[var(--blog-border)]" />
              <div className="h-4 w-5/6 rounded bg-[var(--blog-border)]" />
              <div className="h-4 w-4/5 rounded bg-[var(--blog-border)]" />
              <div className="h-4 w-3/4 rounded bg-[var(--blog-border)]" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
