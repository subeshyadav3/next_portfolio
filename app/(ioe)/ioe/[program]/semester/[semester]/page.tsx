import Link from "next/link";
import { notFound } from "next/navigation";
import { IOE_ENABLED, IOE_SEMESTERS } from "@/lib/ioe/config";
import {
  findCatalogSubject,
  getAllPrograms,
  getProgram,
  getSemesterSubjects,
  getSubjectPrimaryPath,
  getSyllabusForSubject,
} from "@/lib/ioe/data";
import { hasQuestionBankForSubject } from "@/lib/ioe/server-helpers";
import { SubjectCard } from "@/components/ioe/SubjectCard";
import { buildIoeMetadata, breadcrumbLd, jsonLd, collectionLd } from "@/lib/ioe/seo";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";

interface PageProps {
  params: Promise<{ program: string; semester: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  if (!IOE_ENABLED) return [];
  const params: Array<{ program: string; semester: string }> = [];
  for (const program of getAllPrograms()) {
    for (const semester of Object.keys(program.semesters)) {
      params.push({ program: program.slug, semester });
    }
  }
  return params;
}

export async function generateMetadata({ params }: PageProps) {
  const { program: slug, semester } = await params;
  const program = getProgram(slug);
  if (!program || !(semester in program.semesters)) return {};
  return buildIoeMetadata({
    title: `${program.name} Semester ${semester} Past Question Papers & Syllabus — IOE PYQs`,
    description: `Download IOE past question papers (PDF), curriculum syllabus, and exam pattern for ${program.fullName} (${program.code}) Semester ${semester}.`,
    path: `/ioe/${program.slug}/semester/${semester}`,
    keywords: [
      `IOE ${program.code} semester ${semester} past papers`,
      `${program.name} semester ${semester} PYQ`,
      `IOE ${program.code} sem ${semester} syllabus`,
      `${program.code} semester ${semester} PDF download`,
      `Tribhuvan University ${program.code} semester ${semester}`,
    ],
  });
}

export default async function IoeSemesterPage({ params }: PageProps) {
  const { program: slug, semester } = await params;
  if (!IOE_ENABLED) notFound();
  const program = getProgram(slug);
  if (!program || !(semester in program.semesters)) notFound();

  const subjects = getSemesterSubjects(program, semester);
  const activeSemesters = IOE_SEMESTERS.filter((s) => s in program.semesters);
  const currentSemIdx = activeSemesters.indexOf(semester);
  const prevSem = currentSemIdx > 0 ? activeSemesters[currentSemIdx - 1] : null;
  const nextSem =
    currentSemIdx !== -1 && currentSemIdx < activeSemesters.length - 1
      ? activeSemesters[currentSemIdx + 1]
      : null;

  const pyqCount = subjects.filter((s) => hasQuestionBankForSubject(s.title)).length;
  const paperSubjectsCount = subjects.filter((s) => Boolean(findCatalogSubject(s.title))).length;

  const breadcrumb = breadcrumbLd([
    { name: "Home", path: "/" },
    { name: "IOE", path: "/ioe" },
    { name: program.fullName, path: `/ioe/${program.slug}` },
    { name: `Semester ${semester}`, path: `/ioe/${program.slug}/semester/${semester}` },
  ]);

  const collection = collectionLd(
    `${program.fullName} Semester ${semester} Subjects`,
    `IOE ${program.fullName} semester ${semester} subjects and past question papers.`,
    `/ioe/${program.slug}/semester/${semester}`,
    subjects.map((s) => ({
      name: `${s.title} (${s.code})`,
      path: getSubjectPrimaryPath(s.title),
    }))
  );

  return (
    <div className="space-y-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(collection) }} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
        <Link href="/ioe" className="transition-colors hover:text-blue-600 dark:hover:text-blue-400">
          IOE
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        <Link
          href={`/ioe/${program.slug}`}
          className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
        >
          {program.name}
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        <span className="font-semibold text-slate-900 dark:text-white">Semester {semester}</span>
      </nav>

      {/* Semester Header */}
      <header className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs transition-colors dark:border-gray-800/90 dark:bg-gray-900 sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-50/70 via-white to-transparent dark:from-blue-950/25 dark:via-gray-900 dark:to-gray-900" />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-lg bg-blue-600 px-3 py-1 font-mono text-xs font-bold text-white shadow-xs shadow-blue-500/20 dark:bg-blue-500">
              {program.code}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-gray-800 dark:text-slate-300">
              {program.name}
            </span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
              {paperSubjectsCount} with PDFs · {pyqCount} with PYQ Banks
            </span>
          </div>

          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Semester {semester} Subjects
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-400">
            Curriculum subjects for {program.fullName} Semester {semester}. Open any subject hub for
            chapter-wise questions, year-wise papers, PDFs, and official syllabus topics.
          </p>

          {/* Quick Semester Switcher Bar */}
          <div className="mt-6 border-t border-slate-100 pt-4 dark:border-gray-800/80">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="mr-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Semester:
              </span>
              {activeSemesters.map((s) => (
                <Link
                  key={s}
                  href={`/ioe/${program.slug}/semester/${s}`}
                  className={`rounded-lg px-3 py-1.5 font-mono text-xs font-bold transition ${
                    s === semester
                      ? "bg-slate-900 text-white shadow-xs dark:bg-white dark:text-slate-900"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:bg-gray-800 dark:text-slate-300 dark:hover:bg-gray-700 dark:hover:text-white"
                  }`}
                >
                  Sem {s}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Subject Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5 dark:border-gray-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Subjects ({subjects.length})
          </h2>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            Select a subject to open its study hub
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <SubjectCard
              key={subject.code}
              program={program}
              semester={semester}
              subject={subject}
              hasQuestionBank={hasQuestionBankForSubject(subject.title)}
              hasSyllabus={Boolean(getSyllabusForSubject(subject.title))}
            />
          ))}
        </div>
      </section>

      {/* Prev / Next Semester Footer */}
      {(prevSem || nextSem) && (
        <nav
          aria-label="Semester navigation"
          className="flex items-center justify-between gap-3 border-t border-slate-200/80 pt-6 dark:border-gray-800"
        >
          {prevSem ? (
            <Link
              href={`/ioe/${program.slug}/semester/${prevSem}`}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-xs transition hover:border-blue-300 hover:text-blue-600 dark:border-gray-800 dark:bg-gray-900 dark:text-slate-200 dark:hover:border-blue-500/50"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Semester {prevSem}
            </Link>
          ) : (
            <span />
          )}

          {nextSem && (
            <Link
              href={`/ioe/${program.slug}/semester/${nextSem}`}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-xs transition hover:border-blue-300 hover:text-blue-600 dark:border-gray-800 dark:bg-gray-900 dark:text-slate-200 dark:hover:border-blue-500/50"
            >
              Semester {nextSem}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
