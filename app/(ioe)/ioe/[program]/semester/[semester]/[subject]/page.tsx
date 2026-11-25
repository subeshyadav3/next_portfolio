import Link from "next/link";
import { notFound } from "next/navigation";
import { IOE_DOWNLOADS_ENABLED, IOE_ENABLED } from "@/lib/ioe/config";
import {
  findCatalogSubject,
  getAllPrograms,
  getPapersForSubject,
  getSyllabusForSubject,
  getAssessmentScheme,
  getSubjectQuestions,
  getSubjectSlugFromName,
} from "@/lib/ioe/data";
import { SubjectStudyHub } from "@/components/ioe/SubjectStudyHub";
import { buildIoeMetadata, breadcrumbLd, jsonLd, learningResourceLd } from "@/lib/ioe/seo";
import { ChevronRight, FileText, Flame, BookOpen, Calendar, Download } from "lucide-react";

interface PageProps {
  params: Promise<{ program: string; semester: string; subject: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  if (!IOE_ENABLED) return [];
  const params: Array<{ program: string; semester: string; subject: string }> = [];
  for (const program of getAllPrograms()) {
    for (const [semester, subjects] of Object.entries(program.semesters)) {
      for (const subject of subjects) {
        if (findCatalogSubject(subject.title)) {
          params.push({
            program: program.slug,
            semester,
            subject: getSubjectSlugFromName(subject.title),
          });
        }
      }
    }
  }
  return params;
}

export async function generateMetadata({ params }: PageProps) {
  const { program: programSlug, semester, subject: subjectSlug } = await params;
  const program = getAllPrograms().find((p) => p.slug === programSlug);
  const subjectRow = program?.semesters[semester]?.find(
    (s) => getSubjectSlugFromName(s.title) === subjectSlug
  );
  const catalog = findCatalogSubject(subjectRow?.title ?? "");
  if (!subjectRow || !catalog) return {};
  const currentPath = `/ioe/${programSlug}/semester/${semester}/${subjectSlug}`;
  return buildIoeMetadata({
    title: `${subjectRow.title} IOE PYQ Past Year Questions & Syllabus PDF`,
    description: `Browse ${subjectRow.title} (${subjectRow.code}) IOE past year question papers (PYQ PDF) for ${program.fullName} Semester ${semester}, with a curriculum syllabus breakdown and archive source details.`,
    path: currentPath,
    keywords: [
      `${subjectRow.title} IOE PYQ`,
      `${subjectRow.title} past year question`,
      `${subjectRow.title} past paper PDF`,
      `${subjectRow.title} syllabus IOE`,
      `${subjectRow.code} past papers`,
      `IOE ${program.code} semester ${semester} ${subjectRow.title}`,
      `IOE exam questions ${subjectRow.title}`,
      `Tribhuvan University ${subjectRow.title} PDF`,
    ],
  });
}

export default async function IoeSubjectPage({ params }: PageProps) {
  const { program: programSlug, semester, subject: subjectSlug } = await params;
  if (!IOE_ENABLED) notFound();

  const program = getAllPrograms().find((p) => p.slug === programSlug);
  const subjectRow = program?.semesters[semester]?.find(
    (s) => getSubjectSlugFromName(s.title) === subjectSlug
  );
  const catalog = findCatalogSubject(subjectRow?.title ?? "");
  if (!program || !subjectRow || !catalog) notFound();

  const papers = getPapersForSubject(catalog, semester);
  if (papers.length === 0) notFound();

  const syllabus = getSyllabusForSubject(subjectRow.title);
  const assessment = getAssessmentScheme(subjectRow.title);
  const questionsData = await getSubjectQuestions(subjectSlug);
  const semShort = `Sem ${semester}`;
  const path = `/ioe/${programSlug}/semester/${semester}/${subjectSlug}`;

  const breadcrumb = breadcrumbLd([
    { name: "Home", path: "/" },
    { name: "IOE", path: "/ioe" },
    { name: program.fullName, path: `/ioe/${program.slug}` },
    { name: semShort, path: `/ioe/${program.slug}/semester/${semester}` },
    { name: subjectRow.title, path },
  ]);

  const questionCount = questionsData?.questions.length ?? 0;
  const chapterCount = questionsData?.chapters?.length ?? 0;
  const sessionCount =
    questionsData?.yearWisePapers?.length ??
    new Set(
      (questionsData?.questions ?? []).flatMap(
        (q) => q.years || q.examSessions || (q.year ? [q.year] : [])
      )
    ).size;

  const firstPaper = papers[0];
  const semesterSubjects = program.semesters[semester] ?? [];

  return (
    <div className="min-w-0 space-y-5 sm:space-y-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumb) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            learningResourceLd({
              title: `${subjectRow.title} (${subjectRow.code})`,
              description: `IOE ${program.name} semester ${semester} past question papers and curriculum syllabus.`,
              path,
              program,
              semester,
              papers: papers.length,
            })
          ),
        }}
      />

      {/* ── Breadcrumbs ── */}
      <nav className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
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
        <Link
          href={`/ioe/${program.slug}/semester/${semester}`}
          className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
        >
          {semShort}
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        <span className="max-w-[200px] truncate font-semibold text-slate-900 dark:text-white sm:max-w-none">
          {subjectRow.title}
        </span>
      </nav>

      {/* ── Subject header ── */}
      <header className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xs dark:border-gray-800/90 dark:bg-gray-900">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-transparent dark:from-blue-950/30 dark:via-gray-900 dark:to-gray-900" />
        <div className="relative p-5 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-lg bg-blue-600 px-3 py-1 font-mono text-xs font-bold text-white shadow-xs shadow-blue-500/20 dark:bg-blue-500">
              {subjectRow.code}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-gray-800 dark:text-slate-300">
              {program.fullName}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-gray-800 dark:text-slate-300">
              Semester {semester}
            </span>
          </div>

          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            {subjectRow.title}
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
            Past question papers, chapter-wise repeated questions, year-wise exam papers, and the
            official curriculum syllabus for {subjectRow.title} under IOE, Tribhuvan University.
          </p>

          {/* Stats */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white/70 px-3 py-1.5 text-xs font-semibold text-slate-700 backdrop-blur dark:border-gray-700/70 dark:bg-gray-800/60 dark:text-slate-300">
              <FileText className="h-3.5 w-3.5 text-blue-500" />
              {papers.length} {papers.length === 1 ? "paper" : "papers"}
            </span>
            {questionCount > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white/70 px-3 py-1.5 text-xs font-semibold text-slate-700 backdrop-blur dark:border-gray-700/70 dark:bg-gray-800/60 dark:text-slate-300">
                <Flame className="h-3.5 w-3.5 text-amber-500" />
                {questionCount} chapter PYQs
              </span>
            )}
            {chapterCount > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white/70 px-3 py-1.5 text-xs font-semibold text-slate-700 backdrop-blur dark:border-gray-700/70 dark:bg-gray-800/60 dark:text-slate-300">
                <BookOpen className="h-3.5 w-3.5 text-violet-500" />
                {chapterCount} chapters
              </span>
            )}
            {sessionCount > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white/70 px-3 py-1.5 text-xs font-semibold text-slate-700 backdrop-blur dark:border-gray-700/70 dark:bg-gray-800/60 dark:text-slate-300">
                <Calendar className="h-3.5 w-3.5 text-emerald-500" />
                {sessionCount} exam sessions
              </span>
            )}
          </div>

          {/* Primary actions */}
          <div className="mt-5 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <a
              href="#papers"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 dark:border-blue-900/60 dark:bg-blue-950/50 dark:text-blue-300 dark:hover:bg-blue-900/50 sm:px-4 sm:py-2"
            >
              <FileText className="h-3.5 w-3.5 shrink-0" />
              <span>View PDFs</span>
            </a>
            {IOE_DOWNLOADS_ENABLED && (
              <a
                href={firstPaper.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2.5 text-xs font-semibold text-white shadow-xs shadow-blue-500/20 transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 sm:px-4 sm:py-2"
              >
                <Download className="h-3.5 w-3.5 shrink-0" />
                <span>Download</span>
              </a>
            )}
            {syllabus?.syllabus && (
              <a
                href={syllabus.syllabus}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 dark:border-gray-700 dark:bg-gray-900 dark:text-slate-300 dark:hover:bg-gray-800 sm:py-2 ${IOE_DOWNLOADS_ENABLED ? "col-span-2 sm:col-span-1" : ""}`}
              >
                <FileText className="h-3.5 w-3.5 shrink-0 text-blue-500" />
                <span>Syllabus PDF</span>
              </a>
            )}
          </div>
        </div>
      </header>

      {/* ── Same-semester subject switcher ── */}
      {semesterSubjects.length > 1 && (
        <nav
          aria-label={`Semester ${semester} subjects`}
          className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none"
        >
          <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {semShort}:
          </span>
          {semesterSubjects.map((subject) => {
            const slug = getSubjectSlugFromName(subject.title);
            const isActive = slug === subjectSlug;
            const subjectCatalog = findCatalogSubject(subject.title);
            const hasPaper = Boolean(subjectCatalog && subjectCatalog.papers.length > 0);

            if (!hasPaper) {
              return (
                <span
                  key={subject.code}
                  aria-disabled="true"
                  title="No PDF available yet"
                  className="inline-flex shrink-0 cursor-not-allowed items-center gap-1.5 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px] font-medium text-slate-400 opacity-70 dark:border-gray-700 dark:bg-gray-900 dark:text-slate-500"
                >
                  <span className="font-mono text-[9px] opacity-70">{subject.code}</span>
                  {subject.title}
                </span>
              );
            }

            return (
              <Link
                key={subject.code}
                href={`/ioe/${program.slug}/semester/${semester}/${slug}`}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-[11px] font-medium transition ${
                  isActive
                    ? "bg-blue-600 font-bold text-white shadow-xs shadow-blue-500/20 dark:bg-blue-500"
                    : "border border-slate-200/90 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-600 dark:border-gray-700/80 dark:bg-gray-900 dark:text-slate-300 dark:hover:border-blue-500/60 dark:hover:bg-gray-800"
                }`}
              >
                <span className={`font-mono text-[9px] ${isActive ? "text-blue-100" : "opacity-60"}`}>
                  {subject.code}
                </span>
                {subject.title}
              </Link>
            );
          })}
        </nav>
      )}

      {/* ── Study workspace ── */}
      <SubjectStudyHub
        subject={subjectRow.title}
        code={subjectRow.code}
        programName={program.name}
        semester={semester}
        papers={papers}
        chapters={questionsData?.chapters ?? []}
        questions={questionsData?.questions ?? []}
        yearWisePapers={questionsData?.yearWisePapers}
        syllabus={syllabus}
        assessment={assessment}
      />
    </div>
  );
}
