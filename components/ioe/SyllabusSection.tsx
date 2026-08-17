import Link from "next/link";
import type { IoeSyllabus, IoeSyllabusUnit } from "@/lib/ioe/types";
import { BookOpen, ChevronDown, ExternalLink, FileText } from "lucide-react";

function UnitList({ units }: { units: IoeSyllabusUnit[] }) {
  return (
    <details className="group rounded-2xl border border-slate-200/90 bg-slate-50/60 transition-colors dark:border-gray-800 dark:bg-gray-800/40">
      <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4">
        <span className="text-sm font-semibold text-slate-900 dark:text-white">
          Chapter-wise Units &amp; Topics ({units.length} units)
        </span>
        <ChevronDown className="h-4 w-4 text-slate-400 transition-transform group-open:rotate-180" />
      </summary>
      <ol className="grid gap-x-8 gap-y-6 px-5 pb-5 sm:grid-cols-2">
        {units.map((unit) => (
          <li key={unit.num}>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {unit.num}. {unit.title}
            </h4>
            {unit.topics.length > 0 && (
              <ul className="mt-2 space-y-1">
                {unit.topics.map((topic, i) => (
                  <li
                    key={i}
                    className="text-xs leading-relaxed text-slate-600 dark:text-slate-400"
                  >
                    <span className="font-mono text-slate-400 dark:text-slate-500">
                      {topic.num}
                    </span>{" "}
                    {topic.title}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </details>
  );
}

export default function SyllabusSection({
  subject,
  syllabus,
}: {
  subject: string;
  syllabus: IoeSyllabus | null;
}) {
  if (!syllabus || (!syllabus.syllabus && !syllabus.micro && !syllabus.units?.length)) {
    return null;
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
          <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          Official Syllabus
        </h2>
        {(syllabus.syllabus || syllabus.micro) && (
          <span className="text-xs text-slate-400 dark:text-slate-500">
            Sourced from TU portal
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        {syllabus.syllabus && (
          <Link
            href={syllabus.syllabus}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-100 dark:border-blue-900/60 dark:bg-blue-950/50 dark:text-blue-300 dark:hover:bg-blue-900/40"
          >
            <FileText className="h-4 w-4" />
            Full Syllabus (PDF)
            <ExternalLink className="h-3 w-3 opacity-60" />
          </Link>
        )}
        {syllabus.micro && (
          <Link
            href={syllabus.micro}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-gray-700 dark:bg-gray-900 dark:text-slate-300 dark:hover:bg-gray-800"
          >
            <FileText className="h-4 w-4" />
            Micro Syllabus (PDF)
            <ExternalLink className="h-3 w-3 opacity-60" />
          </Link>
        )}
      </div>

      {syllabus.units?.length ? (
        <UnitList units={syllabus.units} />
      ) : (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Official {subject} syllabus for the current IOE curriculum.
        </p>
      )}
    </section>
  );
}