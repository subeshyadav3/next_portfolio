import Link from "next/link";
import type { IoeSyllabus, IoeSyllabusUnit, IoeSyllabusTopic } from "@/lib/ioe/types";
import { BookOpen, ChevronDown, ExternalLink, FileText, Clock } from "lucide-react";

function isTheoryUnit(unit: IoeSyllabusUnit): boolean {
  const title = unit.title.trim().toLowerCase();
  if (
    title === "practical" ||
    title.startsWith("practical (") ||
    title.startsWith("practicals") ||
    title.startsWith("laboratory work") ||
    title.startsWith("laboratory (") ||
    title.startsWith("reference") ||
    title.startsWith("textbook") ||
    title.startsWith("group project")
  ) {
    return false;
  }
  return true;
}

function cleanTopicList(topics?: IoeSyllabusTopic[]): IoeSyllabusTopic[] {
  if (!topics) return [];
  return topics.filter((t) => {
    const title = t.title.trim().toLowerCase();
    return (
      !title.startsWith("lab ") &&
      !title.startsWith("lab 1") &&
      !title.startsWith("lab 2") &&
      !title.startsWith("laboratory ") &&
      !title.startsWith("reference") &&
      !title.startsWith("practical") &&
      !title.startsWith("group project")
    );
  });
}

function UnitList({ units }: { units: IoeSyllabusUnit[] }) {
  const theoryUnits = units.filter(isTheoryUnit);
  if (theoryUnits.length === 0) return null;

  return (
    <details open className="group rounded-2xl border border-slate-200/90 bg-slate-50/60 transition-colors dark:border-gray-800 dark:bg-gray-800/40">
      <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4">
        <span className="text-sm font-bold text-slate-900 dark:text-white">
          Chapter-wise Units &amp; Micro-Syllabus Topics ({theoryUnits.length} Units)
        </span>
        <ChevronDown className="h-4 w-4 text-slate-400 transition-transform group-open:rotate-180" />
      </summary>
      <ol className="grid gap-x-8 gap-y-6 px-5 pb-5 sm:grid-cols-2">
        {theoryUnits.map((unit) => {
          const topics = cleanTopicList(unit.topics);

          return (
            <li key={unit.num} className="rounded-xl border border-slate-200/60 bg-white p-4 shadow-2xs dark:border-gray-700/60 dark:bg-gray-900/60">
              <div className="flex items-baseline justify-between gap-2 border-b border-slate-100 pb-2 dark:border-gray-800">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {unit.num}. {unit.title}
                </h4>
                {unit.hours && (
                  <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-medium text-slate-400 dark:text-slate-500">
                    <Clock className="h-3 w-3" />
                    {unit.hours}
                  </span>
                )}
              </div>

              {topics.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                  {topics.map((topic, i) => {
                    const code = topic.code || topic.num;
                    const isSubSub = code ? code.split(".").length > 2 : false; // e.g. 1.3.1

                    return (
                      <li
                        key={i}
                        className={`text-xs leading-relaxed ${
                          isSubSub
                            ? "ml-3 border-l-2 border-slate-200 pl-2 text-[11px] text-slate-500 dark:border-gray-700 dark:text-slate-400"
                            : "text-slate-700 dark:text-slate-300 font-medium"
                        }`}
                      >
                        {code && (
                          <span className="font-mono text-[11px] font-semibold text-blue-600 dark:text-blue-400 mr-1.5">
                            {code}
                          </span>
                        )}
                        <span>{topic.title}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
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
          Curriculum Syllabus &amp; Course Topics
        </h2>
        {(syllabus.syllabus || syllabus.micro) && (
          <span className="text-xs text-slate-400 dark:text-slate-500">
            Sourced from TU curriculum portal
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
          Curriculum syllabus for {subject} under the IOE engineering degree program.
        </p>
      )}
    </section>
  );
}