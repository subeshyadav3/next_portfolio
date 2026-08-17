import Link from "next/link";
import { notFound } from "next/navigation";
import { IOE_ENABLED } from "@/lib/ioe/config";
import { getCatalogs, getSubjectSlugFromName } from "@/lib/ioe/data";
import { buildIoeMetadata, collectionLd, jsonLd } from "@/lib/ioe/seo";
import { SubjectFilter } from "@/components/ioe/SubjectFilter";
import { ChevronRight, ArrowRight, FileText } from "lucide-react";

export const metadata = buildIoeMetadata({
  title: "All IOE Subjects A–Z | Question Papers Archive",
  description:
    "Every IOE subject with past question papers in the archive, listed A–Z with paper counts and PDF downloads.",
  path: "/ioe/all",
});

export default function IoeAllSubjectsPage() {
  if (!IOE_ENABLED) notFound();

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
    path: `/ioe/subjects/${getSubjectSlugFromName(s.name)}`,
  }));

  return (
    <div className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            collectionLd(
              "All IOE Subjects",
              "Every IOE subject with past question papers in the archive.",
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
            chapter-wise question banks, and PDF downloads.
          </p>

          {/* Filter */}
          <div className="mt-6">
            <SubjectFilter availableLetters={availableLetters} />
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
                {list.map((subject) => (
                  <Link
                    key={subject.name}
                    data-subject-link
                    data-subject-name={subject.name}
                    href={`/ioe/subjects/${getSubjectSlugFromName(subject.name)}`}
                    className="group flex items-center justify-between rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:border-gray-800/90 dark:bg-gray-900 dark:hover:border-blue-500/50"
                  >
                    <div className="min-w-0 pr-3">
                      <span className="block truncate text-sm font-semibold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400">
                        {subject.name}
                      </span>
                      <span className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
                        <FileText className="h-3 w-3" />
                        {subject.papers.length}{" "}
                        {subject.papers.length === 1 ? "past paper" : "past papers"}
                      </span>
                    </div>
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600 dark:bg-gray-800 dark:text-slate-500 dark:group-hover:bg-blue-950/60 dark:group-hover:text-blue-400">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}