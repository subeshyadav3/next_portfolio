import type { ReactNode } from "react";
import { GraduationCap, FlaskConical, Target, ListChecks } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Definition                                                                */
/* -------------------------------------------------------------------------- */

interface DefinitionProps {
  term: string;
  children: ReactNode;
}

export function Definition({ term, children }: DefinitionProps) {
  return (
    <div className="my-6 rounded-lg border border-indigo-200 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-950/20 p-4 not-prose">
      <dt className="text-sm font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">
        Definition
      </dt>
      <dd className="mt-2">
        <span className="text-lg font-bold text-[var(--blog-text)]">{term}</span>
        <span className="mx-2 text-[var(--blog-text-muted)]">—</span>
        <span className="text-[var(--blog-text-secondary)]">{children}</span>
      </dd>
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
    <div className="my-6 rounded-lg border border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 not-prose">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
        <FlaskConical className="h-4 w-4" />
        <span>{title ?? "Example"}</span>
      </div>
      <div className="prose-sm text-[var(--blog-text)]">{children}</div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  ExamTip                                                                   */
/* -------------------------------------------------------------------------- */

export function ExamTip({ children }: { children: ReactNode }) {
  return (
    <div className="my-6 rounded-lg border-2 border-dashed border-amber-400 dark:border-amber-700 bg-amber-50/40 dark:bg-amber-950/20 p-4 not-prose">
      <div className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-amber-800 dark:text-amber-300">
        <Target className="h-4 w-4" />
        <span>Exam Tip</span>
      </div>
      <div className="text-[var(--blog-text)]">{children}</div>
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
    <div className="my-6 rounded-lg border border-sky-200 dark:border-sky-900 bg-sky-50/30 dark:bg-sky-950/20 p-4 not-prose">
      <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-sky-800 dark:text-sky-300">
        <ListChecks className="h-4 w-4" />
        <span>{title ?? "Key Points"}</span>
      </div>
      <div className="text-[var(--blog-text)] [&>ul]:list-disc [&>ul]:pl-5 [&>ul>li]:my-1">
        {children}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Quote                                                                     */
/* -------------------------------------------------------------------------- */

interface QuoteProps {
  author?: string;
  children: ReactNode;
}

export function Quote({ author, children }: QuoteProps) {
  return (
    <blockquote className="my-6 border-l-4 border-[var(--blog-accent)] bg-[var(--blog-surface)] px-5 py-4 italic text-[var(--blog-text)] not-prose">
      <div className="text-lg leading-relaxed">{children}</div>
      {author && (
        <footer className="mt-2 text-sm font-medium not-italic text-[var(--blog-text-muted)]">
          — {author}
        </footer>
      )}
    </blockquote>
  );
}

/* -------------------------------------------------------------------------- */
/*  PullQuote (large display quote)                                           */
/* -------------------------------------------------------------------------- */

export function PullQuote({ children }: { children: ReactNode }) {
  return (
    <blockquote className="my-8 px-6 text-center font-serif text-2xl font-semibold leading-snug text-[var(--blog-text)] not-prose">
      <span aria-hidden className="text-5xl text-[var(--blog-accent)]">“</span>
      {children}
      <span aria-hidden className="text-5xl text-[var(--blog-accent)]">”</span>
    </blockquote>
  );
}

/* -------------------------------------------------------------------------- */
/*  Notes (alias for the Admonitions note style, kept here for parity)         */
/* -------------------------------------------------------------------------- */

export { Notes } from "@/components/mdx/admonitions";

/* -------------------------------------------------------------------------- */
/*  GraduationCap re-export so authors can use it directly                    */
/* -------------------------------------------------------------------------- */

export { GraduationCap };
