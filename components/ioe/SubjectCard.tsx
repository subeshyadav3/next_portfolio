import Link from "next/link";
import type { IoeCurriculumSubject, IoeProgram } from "@/lib/ioe/types";
import { findCatalogSubject, getSubjectSlugFromName } from "@/lib/ioe/data";
import { FileText, ArrowRight, Lock } from "lucide-react";

interface SubjectCardProps {
  program: IoeProgram;
  semester: string;
  subject: IoeCurriculumSubject;
}

export function SubjectCard({ program, semester, subject }: SubjectCardProps) {
  const catalog = findCatalogSubject(subject.title);
  const hasPapers = !!catalog && catalog.papers.length > 0;
  const papers = catalog?.papers ?? [];
  const paperTags = Array.from(
    new Set(
      papers.map((p) => {
        if (!p.sem) return "";
        return p.sem.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());
      }).filter(Boolean)
    )
  );

  const href = hasPapers
    ? `/ioe/${program.slug}/semester/${semester}/${getSubjectSlugFromName(subject.title)}`
    : undefined;

  const inner = (
    <div className="flex h-full flex-col justify-between">
      {/* Top */}
      <div>
        <div className="flex items-start justify-between gap-2">
          <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-semibold text-slate-600 dark:bg-gray-800 dark:text-slate-300">
            {subject.code}
          </span>
          {hasPapers ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300">
              <FileText className="h-3 w-3" />
              {papers.length} {papers.length === 1 ? "Paper" : "Papers"}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100/80 px-2 py-0.5 text-[10px] font-medium text-slate-400 dark:bg-gray-800 dark:text-slate-500">
              <Lock className="h-2.5 w-2.5" />
              Syllabus Listed
            </span>
          )}
        </div>

        <h3 className="mt-3 text-[14px] font-semibold leading-snug text-slate-900 transition-colors group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400">
          {subject.title}
        </h3>
      </div>

      {/* Bottom */}
      <div className="mt-4 border-t border-slate-100 pt-3 dark:border-gray-800/80">
        {hasPapers ? (
          <div className="flex flex-wrap items-center justify-between gap-2">
            {/* Paper chips */}
            <div className="flex flex-wrap items-center gap-1">
              {paperTags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-medium text-slate-600 dark:bg-gray-800 dark:text-slate-300"
                >
                  {tag}
                </span>
              ))}
              {paperTags.length > 2 && (
                <span className="text-[10px] text-slate-400 dark:text-slate-500">
                  +{paperTags.length - 2} more
                </span>
              )}
            </div>

            <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-blue-600 transition-all group-hover:translate-x-0.5 dark:text-blue-400">
              View Papers <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        ) : (
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            Papers will appear here when archived.
          </p>
        )}
      </div>
    </div>
  );

  const baseClasses =
    "group relative flex flex-col justify-between rounded-2xl border bg-white p-5 shadow-xs transition-all duration-200 dark:bg-gray-900";

  if (href) {
    return (
      <Link
        href={href}
        className={`${baseClasses} border-slate-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:border-gray-800 dark:hover:border-blue-500/50`}
      >
        {inner}
      </Link>
    );
  }

  return (
    <div className={`${baseClasses} border-slate-100 opacity-60 dark:border-gray-800/60`}>
      {inner}
    </div>
  );
}
