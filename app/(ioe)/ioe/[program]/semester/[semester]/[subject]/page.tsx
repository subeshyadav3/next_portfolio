import Link from "next/link";
import { notFound } from "next/navigation";
import { IOE_ENABLED } from "@/lib/ioe/config";
import {
  findCatalogSubject,
  getAllPrograms,
  getPapersForSubject,
  getSubjectQuestions,
  getSubjectSlugFromName,
} from "@/lib/ioe/data";
import { PdfViewer } from "@/components/ioe/PdfViewer";
import { QuestionBank } from "@/components/ioe/QuestionBank";
import { buildIoeMetadata, breadcrumbLd, jsonLd, learningResourceLd } from "@/lib/ioe/seo";
import { ChevronRight, FileText, BookOpen, Layers, Clock } from "lucide-react";

interface PageProps {
  params: Promise<{ program: string; semester: string; subject: string }>;
}

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
  return buildIoeMetadata({
    title: `${subjectRow.title} Past Year Questions (PYQ) IOE PDF`,
    description: `Download ${subjectRow.title} (${subjectRow.code}) IOE past year questions (PYQ) PDF. Chapter-wise question bank with exam repetition frequency for IOE ${program?.name} (${program?.code}) Semester ${semester}, Tribhuvan University.`,
    path: `/ioe/${programSlug}/semester/${semester}/${subjectSlug}`,
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

  const papers = getPapersForSubject(catalog);
  if (papers.length === 0) notFound();

  const questions = await getSubjectQuestions(subjectSlug);
  const chapterList = questions?.chapters?.length
    ? questions.chapters
    : Array.from(new Set(questions?.questions.map((q) => q.chapter) ?? []));

  const semShort = `Sem ${semester}`;
  const path = `/ioe/${programSlug}/semester/${semester}/${subjectSlug}`;

  const breadcrumb = breadcrumbLd([
    { name: "Home", path: "/" },
    { name: "IOE", path: "/ioe" },
    { name: program.fullName, path: `/ioe/${program.slug}` },
    { name: semShort, path: `/ioe/${program.slug}/semester/${semester}` },
    { name: subjectRow.title, path },
  ]);

  return (
    <div className="space-y-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumb) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            learningResourceLd({
              title: `${subjectRow.title} (${subjectRow.code})`,
              description: `IOE ${program.name} semester ${semester} past question papers and chapter-wise question bank.`,
              path,
              program,
              semester,
              papers: papers.length,
              questions: questions?.questions.length,
            })
          ),
        }}
      />

      {/* Breadcrumbs */}
      <nav className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
        <Link href="/ioe" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          IOE
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        <Link href={`/ioe/${program.slug}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          {program.name}
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        <Link href={`/ioe/${program.slug}/semester/${semester}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          {semShort}
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-none">
          {subjectRow.title}
        </span>
      </nav>

      {/* Subject Header */}
      <header className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs transition-colors dark:border-gray-800/90 dark:bg-gray-900 sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-lg bg-blue-600 px-3 py-1 font-mono text-xs font-bold text-white shadow-xs shadow-blue-500/20 dark:bg-blue-500">
            {subjectRow.code}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-gray-800 dark:text-slate-300">
            {program.fullName} · Semester {semester}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            <FileText className="h-3 w-3" />
            {papers.length} {papers.length === 1 ? "Paper" : "Papers"} Available
          </span>
        </div>

        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          {subjectRow.title}
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
          {questions && questions.questions.length > 0
            ? `${questions.questions.length} questions extracted from 2078–2083 BS exam sessions, classified by syllabus chapters and ranked by repetition frequency.`
            : `Official exam question papers available in the PDF viewer below. Review past questions to prepare for your semester final exams.`}
        </p>
      </header>

      {/* Embedded PDF Viewer */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Past Question Papers (PDF)
          </h2>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            Switch tabs to view different exam years
          </span>
        </div>
        <PdfViewer papers={papers} />
      </section>

      {/* Chapter-wise Question Bank or Queued Notice */}
      {questions && questions.questions.length > 0 ? (
        <QuestionBank
          chapters={chapterList}
          questions={questions.questions}
          subject={subjectRow.title}
        />
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-xs transition-colors dark:border-gray-800 dark:bg-gray-900">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-gray-800 dark:text-slate-400">
            <Clock className="h-5 w-5" />
          </div>
          <h3 className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
            Chapter-wise Question Bank in Progress
          </h3>
          <p className="mx-auto mt-1 max-w-md text-xs text-slate-500 dark:text-slate-400">
            AI-assisted chapter extraction is currently processing this subject. In the meantime, use the embedded PDF viewer above to study the full question papers.
          </p>
        </div>
      )}
    </div>
  );
}