import Link from "next/link";
import { notFound } from "next/navigation";
import { IOE_ENABLED, IOE_SEMESTERS } from "@/lib/ioe/config";
import {
  getAllPrograms,
  getProgram,
  getSemesterSubjects,
  getSubjectSlugFromName,
} from "@/lib/ioe/data";
import { SubjectCard } from "@/components/ioe/SubjectCard";
import { buildIoeMetadata, breadcrumbLd, jsonLd, collectionLd } from "@/lib/ioe/seo";
import { ChevronRight, Layers, BookOpen } from "lucide-react";

interface PageProps {
  params: Promise<{ program: string; semester: string }>;
}

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
    title: `${program.fullName} Semester ${semester} Subjects | IOE PYQ Archive`,
    description: `All ${program.fullName} semester ${semester} subjects with course codes and past question papers — PDF viewer, downloads, and chapter-wise questions.`,
    path: `/ioe/${program.slug}/semester/${semester}`,
  });
}

export default async function IoeSemesterPage({ params }: PageProps) {
  const { program: slug, semester } = await params;
  if (!IOE_ENABLED) notFound();
  const program = getProgram(slug);
  if (!program || !(semester in program.semesters)) notFound();

  const subjects = getSemesterSubjects(program, semester);
  const activeSemesters = IOE_SEMESTERS.filter((s) => s in program.semesters);

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
      path: `/ioe/${program.slug}/semester/${semester}/${getSubjectSlugFromName(s.title)}`,
    }))
  );

  return (
    <div className="space-y-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(collection) }} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
        <Link href="/ioe" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          IOE
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        <Link href={`/ioe/${program.slug}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          {program.name}
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        <span className="font-semibold text-slate-900 dark:text-white">Semester {semester}</span>
      </nav>

      {/* Semester Header */}
      <header className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs transition-colors dark:border-gray-800/90 dark:bg-gray-900 sm:p-8">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="rounded-lg bg-blue-600 px-3 py-1 font-mono text-xs font-bold text-white shadow-xs shadow-blue-500/20 dark:bg-blue-500">
            {program.code}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-gray-800 dark:text-slate-300">
            {program.name}
          </span>
        </div>

        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Semester {semester} Subjects
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-400">
          Curriculum subjects for {program.fullName} Semester {semester}. Click on any subject to study past question papers and chapter-wise questions.
        </p>

        {/* Quick Semester Switcher Bar */}
        <div className="mt-6 border-t border-slate-100 pt-4 dark:border-gray-800/80">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-1">
              Jump Semester:
            </span>
            {activeSemesters.map((s) => (
              <Link
                key={s}
                href={`/ioe/${program.slug}/semester/${s}`}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                  s === semester
                    ? "bg-blue-600 text-white shadow-xs shadow-blue-500/20 dark:bg-blue-500"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:bg-gray-800 dark:text-slate-300 dark:hover:bg-gray-700 dark:hover:text-white"
                }`}
              >
                Sem {s}
              </Link>
            ))}
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
            Select a subject to view paper PDFs
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <SubjectCard
              key={subject.code}
              program={program}
              semester={semester}
              subject={subject}
            />
          ))}
        </div>
      </section>
    </div>
  );
}