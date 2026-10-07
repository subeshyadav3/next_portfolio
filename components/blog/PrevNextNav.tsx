import Link from "next/link";
import type { NormalizedPostSummary } from "@/lib/content";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface PrevNextNavProps {
  prev: NormalizedPostSummary | null;
  next: NormalizedPostSummary | null;
}

export function PrevNextNav({ prev, next }: PrevNextNavProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {prev ? (
        <Link
          href={`/blog/${prev.slug}`}
          className="group flex flex-col justify-between rounded-2xl border border-[var(--blog-border)] bg-[var(--blog-surface)] p-5 sm:p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--blog-accent)]/50 hover:shadow-md"
        >
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--blog-text-muted)] group-hover:text-[var(--blog-accent)] transition-colors">
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            Previous Article
          </div>
          <span className="mt-3 text-base font-semibold leading-snug text-[var(--blog-text)] group-hover:text-[var(--blog-accent)] transition-colors line-clamp-2">
            {prev.title}
          </span>
          <span className="mt-2 text-xs text-[var(--blog-text-muted)]">
            {prev.readingTime} min read
          </span>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}

      {next ? (
        <Link
          href={`/blog/${next.slug}`}
          className="group flex flex-col justify-between rounded-2xl border border-[var(--blog-border)] bg-[var(--blog-surface)] p-5 sm:p-6 text-right transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--blog-accent)]/50 hover:shadow-md sm:ml-auto w-full"
        >
          <div className="flex items-center justify-end gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--blog-text-muted)] group-hover:text-[var(--blog-accent)] transition-colors">
            Next Article
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </div>
          <span className="mt-3 text-base font-semibold leading-snug text-[var(--blog-text)] group-hover:text-[var(--blog-accent)] transition-colors line-clamp-2">
            {next.title}
          </span>
          <span className="mt-2 text-xs text-[var(--blog-text-muted)]">
            {next.readingTime} min read
          </span>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}
    </div>
  );
}
