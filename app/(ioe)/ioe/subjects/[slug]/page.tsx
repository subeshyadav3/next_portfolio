import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { IOE_ENABLED } from "@/lib/ioe/config";
import {
  findCatalogSubject,
  getAllPrograms,
  getCatalogs,
  getPapersForSubject,
  getSubjectQuestions,
  getSubjectSlugFromName,
  getSyllabusForSubject,
  normalizeSubjectName,
} from "@/lib/ioe/data";
import { PdfViewer } from "@/components/ioe/PdfViewer";
import { QuestionBank } from "@/components/ioe/QuestionBank";
import SyllabusSection from "@/components/ioe/SyllabusSection";
import { buildIoeMetadata, breadcrumbLd, jsonLd, learningResourceLd } from "@/lib/ioe/seo";
import { ChevronRight, FileText, Clock } from "lucide-react";

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
    title: `${subject.name} Past Year Questions (PYQ) IOE PDF`,
    description: `Download ${subject.name} IOE past year questions (PYQ) PDF. Chapter-wise question bank with exam repetition frequency for TU IOE engineering students.`,
    path: `/ioe/subjects/${slug}`,
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
  const questions = await getSubjectQuestions(slug);
  const syllabus = getSyllabusForSubject(subject.name);
  const chapterList = questions?.chapters?.length
    ? questions.chapters
    : Array.from(new Set(questions?.questions.map((q) => q.chapter) ?? []));

  const path = `/ioe/subjects/${slug}`;
  const breadcrumb = breadcrumbLd([
    { name: "Home", path: "/" },
    { name: "IOE", path: "/ioe" },
    { name: "All Subjects", path: "/ioe/all" },
    { name: subject.name, path },
  ]);

  return (
    <div className="space-y-8">
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
              questions: questions?.questions.length,
            })
          ),
        }}
      />

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
        <Link href="/ioe" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          IOE
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        <Link href="/ioe/all" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          All Subjects
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-none">
          {subject.name}
        </span>
      </nav>

      {/* Header */}
      <header className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs transition-colors dark:border-gray-800/90 dark:bg-gray-900 sm:p-8">
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
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
          {questions && questions.questions.length > 0
            ? `${questions.questions.length} questions extracted from 2078–2083 BS exam sessions, classified by syllabus chapters and ranked by repetition frequency.`
            : `Official exam question papers available in the PDF viewer below. Review past questions to prepare for your semester final exams.`}
        </p>
      </header>

      {/* Official Syllabus */}
      <SyllabusSection subject={subject.name} syllabus={syllabus} />

      {/* PDF Viewer */}
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

      {/* Question Bank */}
      {questions && questions.questions.length > 0 ? (
        <QuestionBank
          chapters={chapterList}
          questions={questions.questions}
          subject={subject.name}
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
            AI-assisted chapter extraction is queued for this subject. Use the embedded PDF viewer above to study the question papers.
          </p>
        </div>
      )}
    </div>
  );
}
