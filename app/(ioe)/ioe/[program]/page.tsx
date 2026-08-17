import Link from "next/link";
import { notFound } from "next/navigation";
import { IOE_ENABLED, IOE_SEMESTERS } from "@/lib/ioe/config";
import {
  findCatalogSubject,
  getAllPrograms,
  getProgram,
  getSemesterSubjects,
} from "@/lib/ioe/data";
import { ProgramHubView } from "@/components/ioe/ProgramHubView";
import { buildIoeMetadata, breadcrumbLd, jsonLd } from "@/lib/ioe/seo";
import { ChevronRight, Layers, FileText, BookOpen } from "lucide-react";

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
    title: `${program.fullName} (${program.code}) Past Question Papers & Syllabus - IOE TU`,
    description: `Official IOE past question papers (PDF), curriculum, and semester syllabus for ${program.fullName} (${program.code}) from 2078 to 2083 BS. Download or preview online.`,
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

  // Tier 1 deep programs have individual subject chapter banks
  const isDeepProgram = ["bct", "bce", "bei", "bex"].includes(program.code.toLowerCase());

  const breadcrumb = breadcrumbLd([
    { name: "Home", path: "/" },
    { name: "IOE", path: "/ioe" },
    { name: program.fullName, path: `/ioe/${program.slug}` },
  ]);

  // Schema markup for SEO & Google Rich Results
  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": `${program.fullName} (${program.code})`,
    "description": program.description,
    "provider": {
      "@type": "EducationalOrganization",
      "name": "Institute of Engineering (IOE), Tribhuvan University",
      "sameAs": "https://ioe.edu.np"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `Where can I download IOE ${program.code} past question papers?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `You can download official IOE Tribhuvan University past question papers (PDF) for all semesters of ${program.fullName} directly from this hub.`
        }
      },
      {
        "@type": "Question",
        "name": `What is the passing mark for IOE ${program.code} examinations?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `For IOE 80-mark final board exams, the passing mark is 32. For 20-mark internal theory assessments, the passing mark is 8.`
        }
      }
    ]
  };

  return (
    <div className="space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(courseSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema) }}
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
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300">
              2078–2083 BS Verified
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
              {totalSubjects} Total Courses
            </span>
            <span className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <FileText className="h-4 w-4 text-violet-500" />
              {subjectsWithPapersCount} Subjects with Official PYQs
            </span>
          </div>
        </div>
      </header>

      {/* ── Interactive Hub View ── */}
      <ProgramHubView
        program={program}
        semesterRows={semesterRows}
        isDeepProgram={isDeepProgram}
      />
    </div>
  );
}