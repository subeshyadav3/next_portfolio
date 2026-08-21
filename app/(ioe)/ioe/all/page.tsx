import Link from "next/link";
import { notFound } from "next/navigation";
import { IOE_ENABLED } from "@/lib/ioe/config";
import {
  getCatalogs,
  getAllPrograms,
  getSubjectPrograms,
  getSubjectPrimaryPath,
  isSubjectPublic,
} from "@/lib/ioe/data";
import { buildIoeMetadata, collectionLd, jsonLd } from "@/lib/ioe/seo";
import { SubjectFilter } from "@/components/ioe/SubjectFilter";
import { ChevronRight, ArrowRight, FileText, Sparkles } from "lucide-react";

export const metadata = buildIoeMetadata({
  title: "All IOE Engineering Subjects A–Z | Past Question Papers & Syllabus PDF",
  description:
    "Complete directory of IOE past examination question papers (PYQs) and curriculum syllabus for all engineering disciplines across all semesters.",
  path: "/ioe/all",
  keywords: [
    "all IOE subjects past papers",
    "IOE question bank A-Z",
    "IOE syllabus download",
    "IOE PYQ collection",
    "Tribhuvan University engineering subjects list",
  ],
});

export default function IoeAllSubjectsPage() {
  if (!IOE_ENABLED) notFound();

  const allPrograms = getAllPrograms();
  const disciplines = allPrograms.map((p) => ({
    code: p.code,
    name: p.name,
  }));

  const subjects = getCatalogs().sort((a, b) => a.name.localeCompare(b.name));
  const totalPapers = subjects.reduce((n, s) => n + s.papers.length, 0);

  // Group by first letter
  const grouped: Record<string, typeof subjects> = {};
  for (const subject of subjects) {
    const letter = subject.name[0]?.toUpperCase() ?? "#";
    if (!grouped[letter]) grouped[letter] = [];
    grouped[letter].push(subject);
  }

  const availableLetters = Object.keys(grouped).sort();

  const items = subjects.map((s) => ({
    name: s.name,
    path: getSubjectPrimaryPath(s.name),
  }));

  return (
    <div className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            collectionLd(
              "All IOE Subjects",
              "Every IOE subject with past question papers in the archive across all 12 engineering disciplines.",
              "/ioe/all",
              items
            )
          ),
        }}
      />

      {/* ── Breadcrumb ── */}
      <nav
        className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400"
        aria-label="Breadcrumb"
      >
        <Link href="/ioe" className="transition-colors hover:text-blue-600 dark:hover:text-blue-400">
          IOE
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600" />
        <span className="font-semibold text-slate-900 dark:text-white">All Subjects</span>
      </nav>

      {/* ── Header ── */}
      <header className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900 sm:p-8">
        {/* Texture */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, #94a3b8 1px, transparent 0)",
            backgroundSize: "20px 20px",
          }}
        />

        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-lg bg-blue-600 px-3 py-1 font-mono text-xs font-bold text-white shadow-sm shadow-blue-500/20 dark:bg-blue-500">
              A–Z Directory
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-gray-800 dark:text-slate-300">
              {disciplines.length} Disciplines
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-gray-800 dark:text-slate-300">
              {subjects.length} Subjects
            </span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
              {totalPapers} Exam Papers
            </span>
          </div>

          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            All IOE Subjects A–Z
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Complete archive of all IOE curriculum subjects with past question papers,
            chapter-wise question banks, and PDF downloads across Civil, Computer, Electronics,
            Electrical, Mechanical, Chemical, and other engineering disciplines.
          </p>

          {/* Interactive Filter */}
          <div className="mt-6">
            <SubjectFilter availableLetters={availableLetters} disciplines={disciplines} />
            <div
              id="filtered-subject-count"
              className="mt-2 min-h-[1rem] text-xs font-semibold text-blue-600 dark:text-blue-400"
            />
          </div>
        </div>
      </header>

      {/* ── Alphabetical Sections ── */}
      <div className="space-y-10">
        {availableLetters.map((letter) => {
          const list = grouped[letter];
          return (
            <section key={letter} data-letter-section={letter} className="space-y-3">
              {/* Letter heading */}
              <div className="flex items-center gap-3 border-b border-slate-200/80 pb-2 dark:border-gray-800">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 font-mono text-sm font-extrabold text-white shadow-sm shadow-blue-500/20 dark:bg-blue-500">
                  {letter}
                </span>
                <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                  {list.length} {list.length === 1 ? "subject" : "subjects"}
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((subject) => {
                  const subjectProgs = getSubjectPrograms(subject.name);
                  const dataPrograms = subjectProgs.map((p) => p.code.toLowerCase()).join(",");
                  const primaryPath = getSubjectPrimaryPath(subject.name);
                  const hasQuestions = isSubjectPublic(subject.name);

                  return (
                    <Link
                      key={subject.name}
                      data-subject-link
                      data-subject-name={subject.name}
                      data-programs={dataPrograms}
                      href={primaryPath}
                      className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:border-gray-800/90 dark:bg-gray-900 dark:hover:border-blue-500/50"
                    >
                      <div>
                        {/* Program & Semester Badges */}
                        {subjectProgs.length > 0 && (
                          <div className="mb-2 flex flex-wrap items-center gap-1">
                            {subjectProgs.slice(0, 3).map((p) => (
                              <span
                                key={`${p.code}-${p.semester}`}
                                className="rounded-md bg-blue-50 px-1.5 py-0.5 font-mono text-[10px] font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                              >
                                {p.code} S{p.semester}
                              </span>
                            ))}
                            {subjectProgs.length > 3 && (
                              <span className="text-[10px] font-medium text-slate-400">
                                +{subjectProgs.length - 3} more
                              </span>
                            )}
                          </div>
                        )}

                        <span className="block text-sm font-semibold leading-snug text-slate-900 transition-colors group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400">
                          {subject.name}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 dark:border-gray-800/80">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
                            <FileText className="h-3 w-3" />
                            {subject.papers.length}{" "}
                            {subject.papers.length === 1 ? "paper" : "papers"}
                          </span>
                          {hasQuestions && (
                            <span className="flex items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.2 font-mono text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                              <Sparkles className="h-2.5 w-2.5" />
                              PYQ Bank
                            </span>
                          )}
                        </div>
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600 dark:bg-gray-800 dark:text-slate-500 dark:group-hover:bg-blue-950/60 dark:group-hover:text-blue-400">
                          <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}