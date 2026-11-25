import Link from "next/link";
import { notFound } from "next/navigation";
import { IOE_ENABLED } from "@/lib/ioe/config";
import {
  getAllPrograms,
  getCatalogs,
  getSubjectPrimaryPath,
  getSubjectPrograms,
} from "@/lib/ioe/data";
import { countSubjectsWithQuestionBank, hasQuestionBankForSubject } from "@/lib/ioe/server-helpers";
import { buildIoeMetadata, collectionLd, jsonLd } from "@/lib/ioe/seo";
import {
  AllSubjectsDirectory,
  type DirectorySubjectItem,
} from "@/components/ioe/AllSubjectsDirectory";
import { ChevronRight } from "lucide-react";

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
  const pyqCount = countSubjectsWithQuestionBank();

  const directoryItems: DirectorySubjectItem[] = subjects.map((subject) => ({
    name: subject.name,
    primaryPath: getSubjectPrimaryPath(subject.name),
    papersCount: subject.papers.length,
    hasQuestionBank: hasQuestionBankForSubject(subject.name),
    programs: getSubjectPrograms(subject.name).map((p) => ({
      code: p.code,
      semester: p.semester,
    })),
  }));

  const ldItems = directoryItems.map((s) => ({
    name: s.name,
    path: s.primaryPath,
  }));

  return (
    <div className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            collectionLd(
              "All IOE Subjects",
              "Every IOE subject with past question papers in the archive across all engineering disciplines.",
              "/ioe/all",
              ldItems
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
      <header className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-gray-800/90 dark:bg-gray-900 sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-50/70 via-white to-transparent dark:from-blue-950/25 dark:via-gray-900 dark:to-gray-900" />

        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-lg bg-blue-600 px-3 py-1 font-mono text-xs font-bold text-white shadow-xs dark:bg-blue-500">
              A–Z Directory
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-gray-800 dark:text-slate-300">
              {subjects.length} Subjects
            </span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
              {totalPapers} Exam Papers
            </span>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
              {pyqCount} PYQ Question Banks
            </span>
          </div>

          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            All IOE Subjects A–Z
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Complete archive of IOE curriculum subjects with past question papers, chapter-wise
            question banks, year-wise papers, and PDF downloads across all engineering disciplines.
          </p>
        </div>
      </header>

      <AllSubjectsDirectory subjects={directoryItems} disciplines={disciplines} />
    </div>
  );
}
