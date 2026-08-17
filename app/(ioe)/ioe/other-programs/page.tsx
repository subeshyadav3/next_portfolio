import Link from "next/link";
import { notFound } from "next/navigation";
import { IOE_ENABLED } from "@/lib/ioe/config";
import { getCatalogs } from "@/lib/ioe/data";
import { buildIoeMetadata } from "@/lib/ioe/seo";
import { OtherProgramsViewer } from "@/components/ioe/OtherProgramsViewer";
import { ChevronRight } from "lucide-react";
import programsData from "@/data/ioe/programs.json";
import otherProgramsData from "@/data/ioe/other-programs.json";

export const metadata = buildIoeMetadata({
  title: "Other IOE Engineering Disciplines | Past Question Papers (PDF) & Syllabus",
  description:
    "Past question papers and PDF downloads for Electrical, Mechanical, Automobile, Geomatics, Industrial, Agriculture, Architecture, Aerospace, and Chemical engineering disciplines (TU IOE).",
  path: "/ioe/other-programs",
});

export default function IoeOtherProgramsPage() {
  if (!IOE_ENABLED) notFound();

  // Find all core subject names to separate other subjects
  const coreSubjectNames = new Set<string>();
  for (const prog of programsData.programs) {
    for (const semList of Object.values(prog.semesters)) {
      for (const sub of semList) {
        coreSubjectNames.add(sub.title.trim().toLowerCase());
      }
    }
  }

  // Filter catalog to subjects not in core 3 programs
  const allCatalog = getCatalogs();
  const otherSubjects = allCatalog.filter(
    (s) => !coreSubjectNames.has(s.name.trim().toLowerCase())
  );
  const totalPapers = otherSubjects.reduce((acc, s) => acc + s.papers.length, 0);

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
        <Link href="/ioe" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          IOE
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        <span className="font-semibold text-slate-900 dark:text-white">Other Engineering Disciplines</span>
      </nav>

      {/* Header */}
      <header className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs transition-colors dark:border-gray-800/90 dark:bg-gray-900 sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-lg bg-blue-600 px-3 py-1 font-mono text-xs font-bold text-white shadow-xs shadow-blue-500/20 dark:bg-blue-500">
            Archive Directory
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-gray-800 dark:text-slate-300">
            {otherProgramsData.programs.length} Disciplines
          </span>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            {otherSubjects.length} Subjects · {totalPapers} Papers
          </span>
        </div>

        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Other Engineering Programs &amp; Subject Papers
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
          Past exam question papers archive for Electrical (BEE), Mechanical (BME), Automobile (BAE), Geomatics (BGE), Industrial (BIE), Agriculture (BAG), Architecture (BArch), Aerospace (BAS), and Chemical (BCH) engineering disciplines. Click any subject to preview the question paper or download the PDF.
        </p>

        {/* Program Quick Jump Pills */}
        <div className="mt-5 flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-gray-800">
          {otherProgramsData.programs.map((p) => (
            <span
              key={p.code}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-gray-800 dark:bg-gray-950 dark:text-slate-300"
            >
              <span className="font-mono text-blue-600 dark:text-blue-400">{p.code}</span>
              <span>{p.name}</span>
            </span>
          ))}
        </div>
      </header>

      {/* Main Interactive Viewer */}
      <OtherProgramsViewer
        subjects={otherSubjects}
        programs={otherProgramsData.programs}
      />
    </div>
  );
}
