import Link from "next/link";
import { notFound } from "next/navigation";
import { IOE_ENABLED, IOE_SEMESTERS } from "@/lib/ioe/config";
import {
  findCatalogSubject,
  getAllPrograms,
  getProgram,
  getSemesterSubjects,
} from "@/lib/ioe/data";
import { SubjectCard } from "@/components/ioe/SubjectCard";
import { buildIoeMetadata, breadcrumbLd, jsonLd } from "@/lib/ioe/seo";
import { ChevronRight, Layers, FileText, BookOpen, ArrowRight } from "lucide-react";

interface PageProps {
  params: Promise<{ program: string }>;
}

export function generateStaticParams() {
  if (!IOE_ENABLED) return [];
  return getAllPrograms().map((p) => ({ program: p.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { program: slug } = await params;
  const program = getProgram(slug);
  if (!program) return {};
  return buildIoeMetadata({
    title: `${program.fullName} (${program.code}) Past Question Papers by Semester`,
    description: program.description,
    path: `/ioe/${program.slug}`,
  });
}

export default async function IoeProgramPage({ params }: PageProps) {
  const { program: slug } = await params;
  if (!IOE_ENABLED) notFound();
  const program = getProgram(slug);
  if (!program) notFound();

  const semesterRows = IOE_SEMESTERS.map((sem) => ({
    sem,
    subjects: getSemesterSubjects(program, sem),
  })).filter((row) => row.subjects.length > 0);

  const totalSubjects = semesterRows.reduce((n, r) => n + r.subjects.length, 0);
  const subjectsWithPapersCount = semesterRows.reduce(
    (n, r) => n + r.subjects.filter((s) => findCatalogSubject(s.title)).length,
    0
  );

  const breadcrumb = breadcrumbLd([
    { name: "Home", path: "/" },
    { name: "IOE", path: "/ioe" },
    { name: program.fullName, path: `/ioe/${program.slug}` },
  ]);

  return (
    <div className="space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumb) }}
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
        <span className="font-semibold text-slate-900 dark:text-white">{program.name}</span>
      </nav>

      {/* ── Program Header ── */}
      <header className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900 sm:p-8">
        {/* Subtle texture */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #94a3b8 1px, transparent 0)",
            backgroundSize: "20px 20px",
          }}
        />

        <div className="relative">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="rounded-lg bg-blue-600 px-3 py-1 font-mono text-xs font-bold text-white shadow-sm shadow-blue-500/20 dark:bg-blue-500">
              {program.code}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-gray-800 dark:text-slate-300">
              Undergraduate B.E. Curriculum
            </span>
          </div>

          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            {program.fullName}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-[15px]">
            {program.description}
          </p>

          {/* Stats bar */}
          <div className="mt-6 flex flex-wrap items-center gap-5 border-t border-slate-100 pt-5 text-xs font-semibold dark:border-gray-800">
            <span className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <Layers className="h-4 w-4 text-blue-500" />
              {semesterRows.length} Semesters
            </span>
            <span className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <BookOpen className="h-4 w-4 text-emerald-500" />
              {totalSubjects} Total Subjects
            </span>
            <span className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <FileText className="h-4 w-4 text-violet-500" />
              {subjectsWithPapersCount} Subjects with PYQs
            </span>
          </div>
        </div>
      </header>

      {/* ── Semester Quick Jump ── */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Jump to:
        </span>
        {semesterRows.map(({ sem }) => (
          <a
            key={sem}
            href={`#semester-${sem}`}
            className="rounded-lg bg-slate-100 px-3 py-1 font-mono text-xs font-bold text-slate-600 transition hover:bg-blue-50 hover:text-blue-600 dark:bg-gray-800 dark:text-slate-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            Sem {sem}
          </a>
        ))}
      </div>

      {/* ── Semesters ── */}
      <div className="space-y-14">
        {semesterRows.map(({ sem, subjects }) => {
          const withPapers = subjects.filter((s) => findCatalogSubject(s.title));
          return (
            <section key={sem} id={`semester-${sem}`} className="scroll-mt-20 space-y-4">
              {/* Semester heading row */}
              <div className="flex flex-wrap items-end justify-between gap-2 border-b border-slate-200/80 pb-3 dark:border-gray-800">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 font-mono text-xs font-extrabold text-white shadow-sm dark:bg-blue-500">
                    S{sem}
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
                      Semester {sem}
                    </h2>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">
                      {withPapers.length} of {subjects.length} subjects have papers
                    </p>
                  </div>
                </div>

                <Link
                  href={`/ioe/${program.slug}/semester/${sem}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
                >
                  View Semester Page <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              {/* Subject cards */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {subjects.map((subject) => (
                  <SubjectCard
                    key={subject.code}
                    program={program}
                    semester={sem}
                    subject={subject}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}