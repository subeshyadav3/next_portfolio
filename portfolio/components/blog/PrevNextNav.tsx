import Link from "next/link";
import type { NormalizedPostSummary } from "@/lib/content";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
          className="group flex flex-col rounded-xl border border-[var(--blog-border)] bg-[var(--blog-surface)] p-5 hover:border-[var(--blog-accent)] transition-colors"
        >
          <span className="flex items-center gap-2 text-sm text-[var(--blog-text-muted)]">
            <ChevronLeft className="h-4 w-4" />
            Previous
          </span>
          <span className="mt-2 font-medium text-[var(--blog-text)] group-hover:text-[var(--blog-accent)] transition-colors line-clamp-2">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          href={`/blog/${next.slug}`}
          className="group flex flex-col items-end rounded-xl border border-[var(--blog-border)] bg-[var(--blog-surface)] p-5 hover:border-[var(--blog-accent)] transition-colors text-right"
        >
          <span className="flex items-center gap-2 text-sm text-[var(--blog-text-muted)]">
            Next
            <ChevronRight className="h-4 w-4" />
          </span>
          <span className="mt-2 font-medium text-[var(--blog-text)] group-hover:text-[var(--blog-accent)] transition-colors line-clamp-2">
            {next.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
