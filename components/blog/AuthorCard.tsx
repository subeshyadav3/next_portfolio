import Link from "next/link";
import { User, ArrowUpRight } from "lucide-react";

interface AuthorCardProps {
  name: string;
  authorSlug: string;
  bio?: string;
}

export function AuthorCard({ name, authorSlug, bio }: AuthorCardProps) {
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="rounded-2xl border border-[var(--blog-border)] bg-[var(--blog-surface)] p-6 sm:p-7 shadow-xs transition-shadow hover:shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center gap-5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--blog-accent)]/10 text-xl font-bold text-[var(--blog-accent)] ring-2 ring-[var(--blog-accent)]/20">
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--blog-text-muted)]">
              Published by
            </span>
          </div>
          <h3 className="mt-1 text-lg font-bold text-[var(--blog-text)]">
            <Link
              href={`/blog/author/${authorSlug}`}
              className="hover:text-[var(--blog-accent)] transition-colors inline-flex items-center gap-1 group"
            >
              {name}
              <ArrowUpRight className="h-4 w-4 text-[var(--blog-text-muted)] group-hover:text-[var(--blog-accent)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-[var(--blog-text-secondary)]">
            {bio ?? "Writer and educator sharing Nepali essays, poems, literature, and study notes."}
          </p>
        </div>
      </div>
    </div>
  );
}
