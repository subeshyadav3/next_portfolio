"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  FileText,
  Download,
  Eye,
  Search,
  HelpCircle,
  Award,
  Flame,
  ArrowRight,
  X,
} from "lucide-react";
import type { IoeCurriculumSubject, IoePaper, IoeProgram } from "@/lib/ioe/types";
import {
  findCatalogSubject,
  getAssessmentScheme,
  getPapersForSubject,
  getSubjectSlugFromName,
} from "@/lib/ioe/data";
import { PdfOverlay } from "@/components/pdf/PdfOverlay";

interface ProgramHubViewProps {
  program: IoeProgram;
  semesterRows: {
    sem: string;
    subjects: IoeCurriculumSubject[];
  }[];
  isDeepProgram: boolean;
  questionBankSubjects?: string[];
}

export function ProgramHubView({
  program,
  semesterRows,
  questionBankSubjects = [],
}: ProgramHubViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSem, setActiveSem] = useState<string>("all");
  const [onlyPyqBank, setOnlyPyqBank] = useState(false);
  const [previewModalData, setPreviewModalData] = useState<{
    subject: string;
    papers: IoePaper[];
    activePaperIndex: number;
  } | null>(null);

  const pyqSet = useMemo(() => new Set(questionBankSubjects), [questionBankSubjects]);

  const currentPreviewPaper = previewModalData
    ? previewModalData.papers[previewModalData.activePaperIndex] || previewModalData.papers[0]
    : null;
  const assessment = getAssessmentScheme(program.name);

  const filteredRows = useMemo(() => {
    return semesterRows
      .map((row) => {
        if (activeSem !== "all" && row.sem !== activeSem) return null;
        const matchingSubjects = row.subjects.filter((s) => {
          if (onlyPyqBank && !pyqSet.has(s.title)) return false;
          if (!searchQuery.trim()) return true;
          const q = searchQuery.toLowerCase();
          return s.title.toLowerCase().includes(q) || s.code.toLowerCase().includes(q);
        });
        if (matchingSubjects.length === 0) return null;
        return {
          sem: row.sem,
          subjects: matchingSubjects,
        };
      })
      .filter((r): r is NonNullable<typeof r> => r !== null);
  }, [semesterRows, activeSem, searchQuery, onlyPyqBank, pyqSet]);

  return (
    <div className="space-y-8">
      {/* ── Search & Filter Controls ── */}
      <div className="space-y-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs dark:border-gray-800/90 dark:bg-gray-900">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder={`Search ${program.code} subjects by name or code (e.g. Math, SH 401)...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-9 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:bg-gray-900 sm:text-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setOnlyPyqBank((prev) => !prev)}
            className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-bold transition ${
              onlyPyqBank
                ? "bg-amber-500 text-white shadow-xs"
                : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-gray-700 dark:bg-gray-800 dark:text-slate-300 dark:hover:bg-gray-700"
            }`}
          >
            <Flame className="h-3.5 w-3.5" />
            PYQ Bank Only
          </button>
        </div>

        {/* Semester Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveSem("all")}
            className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              activeSem === "all"
                ? "bg-slate-900 text-white shadow-xs dark:bg-white dark:text-slate-900"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-gray-800 dark:text-slate-300 dark:hover:bg-gray-700"
            }`}
          >
            All Semesters
          </button>
          {semesterRows.map(({ sem }) => (
            <button
              key={sem}
              type="button"
              onClick={() => setActiveSem(sem)}
              className={`shrink-0 rounded-lg px-3 py-1.5 font-mono text-xs font-bold transition ${
                activeSem === sem
                  ? "bg-blue-600 text-white shadow-xs dark:bg-blue-500"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-gray-800 dark:text-slate-300 dark:hover:bg-gray-700"
              }`}
            >
              Sem {sem}
            </button>
          ))}
        </div>
      </div>

      {/* ── Semester Lists ── */}
      <div className="space-y-6">
        {filteredRows.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              No subjects match your current filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveSem("all");
                setOnlyPyqBank(false);
              }}
              className="mt-3 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
            >
              Reset filters
            </button>
          </div>
        ) : (
          filteredRows.map(({ sem, subjects }) => (
            <div
              key={sem}
              id={`semester-${sem}`}
              className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs dark:border-gray-800/90 dark:bg-gray-900"
            >
              {/* Semester Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/75 px-5 py-3.5 dark:border-gray-800 dark:bg-gray-800/40">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 font-mono text-xs font-bold text-white dark:bg-blue-500">
                    S{sem}
                  </span>
                  <Link
                    href={`/ioe/${program.slug}/semester/${sem}`}
                    className="text-base font-bold text-slate-900 transition-colors hover:text-blue-600 dark:text-white dark:hover:text-blue-400 sm:text-lg"
                  >
                    Semester {sem} Curriculum
                  </Link>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {subjects.length} {subjects.length === 1 ? "Subject" : "Subjects"}
                  </span>
                  <Link
                    href={`/ioe/${program.slug}/semester/${sem}`}
                    className="hidden items-center gap-1 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400 sm:inline-flex"
                  >
                    Semester View <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              {/* Subject Rows */}
              <div className="divide-y divide-slate-100 dark:divide-gray-800/60">
                {subjects.map((subject) => {
                  const catalog = findCatalogSubject(subject.title);
                  const matchedPapers = catalog ? getPapersForSubject(catalog, sem) : [];
                  const hasPapers = matchedPapers.length > 0;
                  const primaryPaper = matchedPapers[0];
                  const slug = getSubjectSlugFromName(subject.title);
                  const subjectUrl = `/ioe/${program.slug}/semester/${sem}/${slug}`;
                  const hasPyq = pyqSet.has(subject.title);

                  return (
                    <div
                      key={subject.code}
                      className="flex flex-col justify-between gap-3.5 p-4 transition-colors hover:bg-slate-50/50 dark:hover:bg-gray-800/30 sm:flex-row sm:items-center sm:px-6"
                    >
                      {/* Left: Info */}
                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-semibold text-slate-700 dark:bg-gray-800 dark:text-slate-300">
                            {subject.code}
                          </span>
                          {hasPyq && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                              <Flame className="h-2.5 w-2.5" />
                              PYQ Bank
                            </span>
                          )}
                          {hasPapers ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300">
                              <FileText className="h-2.5 w-2.5" />
                              {matchedPapers.length} {matchedPapers.length === 1 ? "PDF" : "PDFs"}
                            </span>
                          ) : (
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-400 dark:bg-gray-800 dark:text-slate-500">
                              Syllabus Listed
                            </span>
                          )}
                        </div>
                        {hasPapers ? (
                          <Link
                            href={subjectUrl}
                            className="inline-block text-sm font-bold text-slate-900 transition-colors hover:text-blue-600 dark:text-white dark:hover:text-blue-400 sm:text-[15px]"
                          >
                            {subject.title}
                          </Link>
                        ) : (
                          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 sm:text-[15px]">
                            {subject.title}
                          </h3>
                        )}
                      </div>

                      {/* Right: Actions */}
                      <div className="flex w-full items-center gap-2 sm:w-auto sm:shrink-0">
                        {hasPapers && primaryPaper && (
                          <>
                            <Link
                              href={subjectUrl}
                              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white transition hover:bg-blue-600 dark:bg-white dark:text-slate-900 dark:hover:bg-blue-500 dark:hover:text-white sm:flex-none sm:py-1.5"
                            >
                              Study Hub
                              <ArrowRight className="h-3 w-3" />
                            </Link>
                            <button
                              type="button"
                              onClick={() =>
                                setPreviewModalData({
                                  subject: subject.title,
                                  papers: matchedPapers,
                                  activePaperIndex: 0,
                                })
                              }
                              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-slate-200 dark:hover:bg-gray-700 sm:py-1.5"
                            >
                              <Eye className="h-3.5 w-3.5 text-blue-500" />
                              PDF
                            </button>
                            <a
                              href={primaryPaper.downloadUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Download PDF"
                              aria-label={`Download ${subject.title} PDF`}
                              className="inline-flex items-center justify-center gap-1 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 dark:border-blue-900/60 dark:bg-blue-950/50 dark:text-blue-300 dark:hover:bg-blue-900/50 sm:px-2.5 sm:py-1.5"
                            >
                              <Download className="h-3.5 w-3.5" />
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Exam Blueprint & FAQ ── */}
      <section className="space-y-6 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-gray-800/90 dark:bg-gray-900 sm:p-8">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            IOE {program.name} Examination Pattern &amp; Syllabus Overview
          </h2>
        </div>

        <div className="grid gap-6 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:grid-cols-2">
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white">
              Assessment Breakdown &amp; Pass Marks
            </h3>
            <p className="text-xs sm:text-sm">
              Under the Institute of Engineering (IOE), Tribhuvan University curriculum, each course
              uses a standard evaluation criteria consisting of:
            </p>
            <ul className="list-inside list-disc space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <strong>Final Board Theory Exam:</strong> {assessment.theory} Marks (Pass mark:{" "}
                {assessment.passTheory})
              </li>
              <li>
                <strong>Internal Assessment:</strong> {assessment.internal} Marks (Pass mark:{" "}
                {assessment.passInternal})
              </li>
              <li>
                <strong>Practical / Lab Evaluation:</strong> 25 or 50 Marks (Continuous assessment +
                practical exam, where applicable)
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white">
              How to Prepare Using Past Question Papers
            </h3>
            <p className="text-xs sm:text-sm">
              Past question papers (PYQs) highlight recurring theoretical derivations, computational
              numericals, and core syllabus weightage across exam sessions:
            </p>
            <ul className="list-inside list-disc space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <li>Open any subject hub to filter questions by chapter and repeat frequency.</li>
              <li>Practice numerical problems with standard formulas and units.</li>
              <li>Verify solutions against the syllabus breakdown tab on each subject page.</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6 dark:border-gray-800">
          <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
            <HelpCircle className="h-4 w-4 text-emerald-500" />
            Frequently Asked Questions ({program.code} Past Papers)
          </h3>
          <div className="mt-4 grid gap-4 text-xs sm:grid-cols-2 sm:text-sm">
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                Can I download the complete PDF papers for offline study?
              </p>
              <p className="mt-1 text-slate-500 dark:text-slate-400">
                Yes, click the download button next to any subject to save the original PDF directly
                with zero paywalls or redirects.
              </p>
            </div>
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                What syllabus does this program follow?
              </p>
              <p className="mt-1 text-slate-500 dark:text-slate-400">
                The course structure reflects available TU/IOE undergraduate engineering curriculum
                data. Verify current examination details with official IOE notices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── In-site PDF full view ── */}
      {previewModalData && currentPreviewPaper && (
        <PdfOverlay
          papers={previewModalData.papers}
          activePaperIndex={previewModalData.activePaperIndex}
          onPaperSelect={(idx) =>
            setPreviewModalData((prev) =>
              prev ? { ...prev, activePaperIndex: idx } : null
            )
          }
          src={currentPreviewPaper.previewUrl}
          title={`${previewModalData.subject} — ${currentPreviewPaper.file}`}
          downloadUrl={currentPreviewPaper.downloadUrl}
          subjectTitle={previewModalData.subject}
          onClose={() => setPreviewModalData(null)}
        />
      )}
    </div>
  );
}
