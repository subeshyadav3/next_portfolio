import type { ReactNode } from "react";
import {
  GraduationCap,
  FlaskConical,
  Target,
  ListChecks,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Definition                                                                */
/* -------------------------------------------------------------------------- */

interface DefinitionProps {
  term: string;
  children: ReactNode;
}

export function Definition({ term, children }: DefinitionProps) {
  return (
    <div className="my-6 rounded-md border border-[var(--blog-border)] border-l-4 border-l-[var(--blog-accent)] bg-[var(--blog-accent-tint)] dark:bg-[var(--blog-accent-tint)] px-4 py-3 not-prose">
      <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--blog-accent)]">
        <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />
        <span>Definition</span>
      </div>
      <p className="text-[0.9375rem] text-[var(--blog-text)] leading-relaxed">
        <span className="font-semibold">{term}</span>
        <span className="mx-2 text-[var(--blog-text-muted)]">—</span>
        <span className="text-[var(--blog-text-secondary)]">{children}</span>
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Example                                                                   */
/* -------------------------------------------------------------------------- */

interface ExampleProps {
  title?: string;
  children: ReactNode;
}

export function Example({ title, children }: ExampleProps) {
  return (
    <div className="my-6 rounded-md border border-[var(--blog-border)] border-l-4 border-l-[var(--blog-accent)] bg-[var(--blog-accent-tint)] dark:bg-[var(--blog-accent-tint)] px-4 py-3 not-prose">
      <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--blog-accent)]">
        <FlaskConical className="h-3.5 w-3.5" aria-hidden="true" />
        <span>{title ?? "Example"}</span>
      </div>
      <div className="text-[0.9375rem] leading-relaxed text-[var(--blog-text-secondary)] [&>p]:my-2 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
        {children}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  ExamTip                                                                   */
/* -------------------------------------------------------------------------- */

export function ExamTip({ children }: { children: ReactNode }) {
  return (
    <div className="my-6 rounded-md border border-[var(--blog-border)] border-l-4 border-l-[var(--blog-accent)] bg-[var(--blog-accent-tint)] dark:bg-[var(--blog-accent-tint)] px-4 py-3 not-prose">
      <div className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--blog-accent)]">
        <Target className="h-3.5 w-3.5" aria-hidden="true" />
        <span>Exam Tip</span>
      </div>
      <div className="text-[0.9375rem] leading-relaxed text-[var(--blog-text)] [&>p]:my-2 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
        {children}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  KeyPoints                                                                 */
/* -------------------------------------------------------------------------- */

interface KeyPointsProps {
  title?: string;
  children: ReactNode;
}

export function KeyPoints({ title, children }: KeyPointsProps) {
  return (
    <div className="my-6 rounded-md border border-[var(--blog-border)] border-l-4 border-l-[var(--blog-accent)] bg-[var(--blog-accent-tint)] dark:bg-[var(--blog-accent-tint)] px-4 py-3 not-prose">
      <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--blog-accent)]">
        <ListChecks className="h-3.5 w-3.5" aria-hidden="true" />
        <span>{title ?? "Key Points"}</span>
      </div>
      <div className="text-[0.9375rem] leading-relaxed text-[var(--blog-text-secondary)] [&>ul]:list-disc [&>ul]:pl-5 [&>ul>li]:my-1.5">
        {children}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Quote — IMPROVED with decorative mark + proper bg                        */
/* -------------------------------------------------------------------------- */

interface QuoteProps {
  author?: string;
  children: ReactNode;
}

export function Quote({ author, children }: QuoteProps) {
  return (
    <blockquote className="relative my-6 rounded-r-md border-l-4 border-[var(--blog-accent)] bg-[var(--blog-bg)] dark:bg-[var(--blog-surface)] px-5 py-4 not-prose">
      <span
        className="absolute left-3 top-1 text-3xl leading-none text-[var(--blog-accent)] opacity-25 select-none font-serif"
        aria-hidden="true"
      >"</span>
      <div className="pl-2 text-[0.9375rem] leading-relaxed text-[var(--blog-text-secondary)] italic [&>p]:my-1.5 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
        {children}
      </div>
      {author && (
        <footer className="mt-3 pl-2 text-xs font-medium text-[var(--blog-text-muted)] not-italic">
          — {author}
        </footer>
      )}
    </blockquote>
  );
}

/* -------------------------------------------------------------------------- */
/*  PullQuote                                                                 */
/* -------------------------------------------------------------------------- */

export function PullQuote({ children }: { children: ReactNode }) {
  return (
    <blockquote className="my-8 border-y-2 border-[var(--blog-accent)] px-6 py-5 text-center font-serif text-xl font-medium leading-snug text-[var(--blog-text)] not-prose opacity-90">
      {children}
    </blockquote>
  );
}

