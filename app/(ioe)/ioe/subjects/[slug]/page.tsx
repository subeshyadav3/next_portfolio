import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { IOE_ENABLED } from "@/lib/ioe/config";
import {
  findCatalogSubject,
  getAllPrograms,
  getAssessmentScheme,
  getCatalogs,
  getPapersForSubject,
  getSubjectQuestions,
  getSubjectSlugFromName,
  getSyllabusForSubject,
  normalizeSubjectName,
} from "@/lib/ioe/data";
import { SubjectStudyHub } from "@/components/ioe/SubjectStudyHub";
import { buildIoeMetadata, breadcrumbLd, jsonLd, learningResourceLd } from "@/lib/ioe/seo";
import { BookOpen, Calendar, ChevronRight, Download, FileText, Flame } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  if (!IOE_ENABLED) return [];
  return getCatalogs().map((s) => ({ slug: getSubjectSlugFromName(s.name) }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const subject = getCatalogs().find((s) => getSubjectSlugFromName(s.name) === slug);
  if (!subject) return {};
  return buildIoeMetadata({
    title: `${subject.name} IOE PYQ Past Year Questions & Official Syllabus`,
    description: `Browse ${subject.name} IOE past year question papers (PYQ PDF) and available curriculum syllabus units for TU engineering students.`,
    path: `/ioe/subjects/${slug}`,
    keywords: [
      `${subject.name} IOE PYQ`,
      `${subject.name} past year question`,
      `${subject.name} past paper PDF`,
      `${subject.name} syllabus IOE`,
      `IOE TU ${subject.name} exam questions`,
    ],
  });
}

export default async function IoeSubjectArchivePage({ params }: PageProps) {
  const { slug } = await params;
  if (!IOE_ENABLED) notFound();

  const subject = getCatalogs().find((s) => getSubjectSlugFromName(s.name) === slug);
  if (!subject) notFound();

  // If this subject belongs to a program curriculum, canonical URL is the
  // program-semester page; redirect to avoid duplicate indexable pages.
  for (const program of getAllPrograms()) {
    for (const [semester, rows] of Object.entries(program.semesters)) {
      for (const row of rows) {
        if (
          normalizeSubjectName(row.title) === normalizeSubjectName(subject.name) &&
          findCatalogSubject(row.title)
        ) {
          redirect(`/ioe/${program.slug}/semester/${semester}/${slug}`);
        }
      }
    }
  }

  const papers = getPapersForSubject(subject);
  if (papers.length === 0) notFound();
  const questionsData = await getSubjectQuestions(slug);
  const syllabus = getSyllabusForSubject(subject.name);
  const assessment = getAssessmentScheme(subject.name);

  const path = `/ioe/subjects/${slug}`;
  const breadcrumb = breadcrumbLd([
    { name: "Home", path: "/" },
    { name: "IOE", path: "/ioe" },
    { name: "All Subjects", path: "/ioe/all" },
    { name: subject.name, path },
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

  return (
    <div className="space-y-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumb) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            learningResourceLd({
              title: subject.name,
              description: `${subject.name} past question papers from the IOE PYQ archive.`,
              path,
              papers: papers.length,
              questions: questionsData?.questions.length,
            })
          ),
        }}
      />

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
        <Link href="/ioe" className="transition-colors hover:text-blue-600 dark:hover:text-blue-400">
          IOE
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        <Link href="/ioe/all" className="transition-colors hover:text-blue-600 dark:hover:text-blue-400">
          All Subjects
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        <span className="max-w-[200px] truncate font-semibold text-slate-900 dark:text-white sm:max-w-none">
          {subject.name}
        </span>
      </nav>

      {/* Header */}
      <header className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xs dark:border-gray-800/90 dark:bg-gray-900">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-transparent dark:from-blue-950/30 dark:via-gray-900 dark:to-gray-900" />
        <div className="relative p-5 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-lg bg-blue-600 px-3 py-1 font-mono text-xs font-bold text-white shadow-xs shadow-blue-500/20 dark:bg-blue-500">
              Subject Archive
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              <FileText className="h-3 w-3" />
              {papers.length} {papers.length === 1 ? "Paper" : "Papers"} Available
            </span>
          </div>

          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            {subject.name}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
            Past examination question papers, chapter-wise repeated questions, and curriculum
            syllabus for {subject.name} under IOE, Tribhuvan University.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white/70 px-3 py-1.5 text-xs font-semibold text-slate-700 backdrop-blur dark:border-gray-700/70 dark:bg-gray-800/60 dark:text-slate-300">
              <FileText className="h-3.5 w-3.5 text-blue-500" />
              {papers.length} {papers.length === 1 ? "paper" : "papers"}
            </span>
            {questionCount > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white/70 px-3 py-1.5 text-xs font-semibold text-slate-700 backdrop-blur dark:border-gray-700/70 dark:bg-gray-800/60 dark:text-slate-300">
                <Flame className="h-3.5 w-3.5 text-amber-500" />
                {questionCount} repeated questions
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

          <div className="mt-5 flex flex-wrap gap-2">
            <a
              href="#papers"
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 dark:border-blue-900/60 dark:bg-blue-950/50 dark:text-blue-300 dark:hover:bg-blue-900/50 sm:flex-none sm:py-2"
            >
              <FileText className="h-3.5 w-3.5" />
              View PDF papers
            </a>
            <a
              href={firstPaper.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs shadow-blue-500/20 transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 sm:flex-none sm:py-2"
            >
              <Download className="h-3.5 w-3.5" />
              Download paper
            </a>
            {syllabus?.syllabus && (
              <a
                href={syllabus.syllabus}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 dark:border-gray-700 dark:bg-gray-900 dark:text-slate-300 dark:hover:bg-gray-800 sm:w-auto sm:py-2"
              >
                <FileText className="h-3.5 w-3.5 text-blue-500" />
                Syllabus PDF
              </a>
            )}
          </div>
        </div>
      </header>

      <SubjectStudyHub
        subject={subject.name}
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
