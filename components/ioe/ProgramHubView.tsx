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
  X,
} from "lucide-react";
import type { IoeCurriculumSubject, IoePaper, IoePaperFile, IoeProgram } from "@/lib/ioe/types";
import { findCatalogSubject, getAssessmentScheme, getPapersForSubject, getSubjectSlugFromName } from "@/lib/ioe/data";

interface ProgramHubViewProps {
  program: IoeProgram;
  semesterRows: {
    sem: string;
    subjects: IoeCurriculumSubject[];
  }[];
  isDeepProgram: boolean; // true for BCT, BCE, BEI
}

export function ProgramHubView({
  program,
  semesterRows,
  isDeepProgram,
}: ProgramHubViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSem, setActiveSem] = useState<string>("all");
  const [previewModalData, setPreviewModalData] = useState<{
    subject: string;
    papers: IoePaper[];
    activePaperIndex: number;
  } | null>(null);

  const currentPreviewPaper = previewModalData
    ? previewModalData.papers[previewModalData.activePaperIndex] || previewModalData.papers[0]
    : null;
  const assessment = getAssessmentScheme(program.name);

  // Flattened search filter
  const filteredRows = useMemo(() => {
    return semesterRows
      .map((row) => {
        if (activeSem !== "all" && row.sem !== activeSem) return null;
        const matchingSubjects = row.subjects.filter((s) => {
          if (!searchQuery.trim()) return true;
          const q = searchQuery.toLowerCase();
          return (
            s.title.toLowerCase().includes(q) || s.code.toLowerCase().includes(q)
          );
        });
        if (matchingSubjects.length === 0) return null;
        return {
          sem: row.sem,
          subjects: matchingSubjects,
        };
      })
      .filter((r): r is NonNullable<typeof r> => r !== null);
  }, [semesterRows, activeSem, searchQuery]);

  return (
    <div className="space-y-8">
      {/* ── Search & Filter Controls ── */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-gray-800 dark:bg-gray-900 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={`Search ${program.code} subjects by name or code (e.g. Math, Thermodynamics)...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:bg-gray-900 sm:text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Clear
            </button>
          )}
        </div>

        {/* Semester Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveSem("all")}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              activeSem === "all"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-gray-800 dark:text-slate-300 dark:hover:bg-gray-700"
            }`}
          >
            All Semesters
          </button>
          {semesterRows.map(({ sem }) => (
            <button
              key={sem}
              onClick={() => setActiveSem(sem)}
              className={`rounded-lg px-3 py-1.5 font-mono text-xs font-bold transition ${
                activeSem === sem
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-gray-800 dark:text-slate-300 dark:hover:bg-gray-700"
              }`}
            >
              Sem {sem}
            </button>
          ))}
        </div>
      </div>

      {/* ── Semester Accordions / Tables ── */}
      <div className="space-y-6">
        {filteredRows.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center dark:border-gray-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No subjects found matching &quot;{searchQuery}&quot;.
            </p>
          </div>
        ) : (
          filteredRows.map(({ sem, subjects }) => (
            <div
              key={sem}
              id={`semester-${sem}`}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-gray-800 dark:bg-gray-900"
            >
              {/* Semester Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/75 px-5 py-3.5 dark:border-gray-800 dark:bg-gray-800/40">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 font-mono text-xs font-bold text-white">
                    S{sem}
                  </span>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white sm:text-lg">
                    Semester {sem} Curriculum &amp; Past Papers
                  </h2>
                </div>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {subjects.length} {subjects.length === 1 ? "Subject" : "Subjects"}
                </span>
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

                  return (
                    <div
                      key={subject.code}
                      className="flex flex-col justify-between gap-4 p-4 transition-colors hover:bg-slate-50/50 dark:hover:bg-gray-800/30 sm:flex-row sm:items-center sm:px-6"
                    >
                      {/* Left: Info */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-semibold text-slate-700 dark:bg-gray-800 dark:text-slate-300">
                            {subject.code}
                          </span>
                          {hasPapers ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300">
                              <FileText className="h-2.5 w-2.5" />
                              PDF Available
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
                            className="group inline-block text-sm font-semibold text-slate-900 transition-colors hover:text-blue-600 dark:text-white dark:hover:text-blue-400 sm:text-[15px]"
                          >
                            {subject.title}
                          </Link>
                        ) : (
                          <h3 className="text-sm font-semibold text-slate-900 dark:text-white sm:text-[15px]">
                            {subject.title}
                          </h3>
                        )}
                      </div>

                      {/* Right: Actions */}
                      <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                        {hasPapers && primaryPaper && (
                          <>
                            <button
                              onClick={() =>
                                setPreviewModalData({
                                  subject: subject.title,
                                  papers: matchedPapers,
                                  activePaperIndex: 0,
                                })
                              }
                              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-slate-200 dark:hover:bg-gray-700"
                            >
                              <Eye className="h-3.5 w-3.5 text-blue-500" />
                              Preview PDF {matchedPapers.length > 1 ? `(${matchedPapers.length})` : ""}
                            </button>
                            <a
                              href={`https://drive.google.com/uc?export=download&id=${primaryPaper.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700"
                            >
                              <Download className="h-3.5 w-3.5" />
                              Download
                            </a>
                            <Link
                              href={subjectUrl}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
                            >
                              View Subject Page &rarr;
                            </Link>
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

      {/* ── Comprehensive Faculty Guide & Exam Blueprint (SEO & AdSense Boost) ── */}
      <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900 sm:p-8">
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
            <p>
              Under the Institute of Engineering (IOE), Tribhuvan University curriculum, each
              course has a standard evaluation criteria consisting of:
            </p>
            <ul className="list-inside list-disc space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <li>
                  <strong>Final Board Theory Exam:</strong> {assessment.theory} Marks (Pass mark: {assessment.passTheory})
              </li>
              <li>
                  <strong>Internal Assessment:</strong> {assessment.internal} Marks (Pass mark: {assessment.passInternal})
              </li>
              <li>
                <strong>Practical / Lab Evaluation:</strong> 25 or 50 Marks (Continuous assessment + practical exam, where applicable)
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white">
              How to Prepare Using Past Question Papers
            </h3>
            <p>
              Past question papers (PYQs) reflect recurring theoretical derivations,
              computational numericals, and core syllabus weightage across exam sessions. Students are advised to:
            </p>
            <ul className="list-inside list-disc space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <li>Review past question papers systematically across chapters for maximum exam coverage.</li>
              <li>Practice numerical problems with standard formulas and units.</li>
              <li>Verify solutions against the official IOE syllabus structure.</li>
            </ul>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="border-t border-slate-100 pt-6 dark:border-gray-800">
          <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
            <HelpCircle className="h-4 w-4 text-emerald-500" />
            Frequently Asked Questions ({program.code} Past Papers)
          </h3>
          <div className="mt-4 space-y-4 text-xs sm:text-sm">
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                Q: Can I download the complete PDF papers for offline study?
              </p>
              <p className="mt-1 text-slate-500 dark:text-slate-400">
                Yes, click the &quot;Download&quot; button next to any subject to save the
                original PDF directly to your device with zero paywalls or redirects.
              </p>
            </div>
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                Q: What syllabus does this program follow?
              </p>
              <p className="mt-1 text-slate-500 dark:text-slate-400">
                The course structure and subject list reflect the available undergraduate engineering curriculum data. Verify current examination details with the official IOE/TU syllabus.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Interactive PDF Preview Modal ── */}
      {previewModalData && currentPreviewPaper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs">
          <div className="flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-gray-900">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-800">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">
                  {previewModalData.subject} — Past Question Paper
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {currentPreviewPaper.file}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={currentPreviewPaper.downloadUrl || `https://drive.google.com/uc?export=download&id=${currentPreviewPaper.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download
                </a>
                <button
                  onClick={() => setPreviewModalData(null)}
                  className="rounded-xl p-1.5 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Paper Selection Tabs (if multiple PDFs exist) */}
            {previewModalData.papers.length > 1 && (
              <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-slate-100/70 px-6 py-2.5 dark:border-gray-800 dark:bg-gray-950">
                <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Available Papers ({previewModalData.papers.length}):
                </span>
                {previewModalData.papers.map((p, idx) => {
                  const isActive = previewModalData.activePaperIndex === idx;
                  const label = p.sem
                    ? p.sem.replace(/-/g, " ").toUpperCase()
                    : `Paper ${idx + 1}`;

                  return (
                    <button
                      key={p.id || idx}
                      onClick={() =>
                        setPreviewModalData({
                          ...previewModalData,
                          activePaperIndex: idx,
                        })
                      }
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition ${
                        isActive
                          ? "bg-blue-600 text-white shadow-xs"
                          : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-gray-800 dark:bg-gray-900 dark:text-slate-300 dark:hover:bg-gray-800"
                      }`}
                    >
                      <FileText className="h-3 w-3" />
                      {label}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Iframe Viewer */}
            <div className="flex-1 bg-slate-100 dark:bg-gray-950">
              <iframe
                key={currentPreviewPaper.id}
                src={currentPreviewPaper.previewUrl || `https://drive.google.com/file/d/${currentPreviewPaper.id}/preview`}
                className="h-full w-full border-none"
                title={`${previewModalData.subject} Past Paper Preview`}
                allow="autoplay"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
