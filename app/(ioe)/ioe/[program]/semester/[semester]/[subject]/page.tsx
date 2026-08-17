import Link from "next/link";
import { notFound } from "next/navigation";
import { IOE_ENABLED } from "@/lib/ioe/config";
import {
  findCatalogSubject,
  getAllPrograms,
  getPapersForSubject,
  getSyllabusForSubject,
  getSubjectSlugFromName,
} from "@/lib/ioe/data";
import { PdfViewer } from "@/components/ioe/PdfViewer";
import SyllabusSection from "@/components/ioe/SyllabusSection";
import { buildIoeMetadata, breadcrumbLd, jsonLd, learningResourceLd } from "@/lib/ioe/seo";
import { ChevronRight, FileText, Award, HelpCircle, CheckCircle2 } from "lucide-react";

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
    description: `Download official ${subjectRow.title} past year question papers (PYQ) PDF. Complete semester syllabus, board examination blueprint, and official TU IOE papers from 2078 to 2083 BS.`,
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

  const papers = getPapersForSubject(catalog, semester);
  if (papers.length === 0) notFound();

  const syllabus = getSyllabusForSubject(subjectRow.title);
  const semShort = `Sem ${semester}`;
  const path = `/ioe/${programSlug}/semester/${semester}/${subjectSlug}`;

  const breadcrumb = breadcrumbLd([
    { name: "Home", path: "/" },
    { name: "IOE", path: "/ioe" },
    { name: program.fullName, path: `/ioe/${program.slug}` },
    { name: semShort, path: `/ioe/${program.slug}/semester/${semester}` },
    { name: subjectRow.title, path },
  ]);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `How can I download ${subjectRow.title} IOE past question papers?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `You can preview or download the official ${subjectRow.title} question papers (PDF) directly using the built-in PDF viewer on this page with zero redirects.`
        }
      },
      {
        "@type": "Question",
        "name": `What is the full mark and pass mark for ${subjectRow.title}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `For the IOE final board theory exam, the full mark is 80 (pass mark: 32). The internal theory assessment is 20 marks (pass mark: 8).`
        }
      }
    ]
  };

  return (
    <div className="space-y-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            learningResourceLd({
              title: `${subjectRow.title} (${subjectRow.code})`,
              description: `Official IOE ${program.name} semester ${semester} past question papers and syllabus.`,
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

      {/* ── Subject Header ── */}
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
          Official past examination question papers and complete curriculum syllabus for {subjectRow.title} ({subjectRow.code}), Institute of Engineering (IOE), Tribhuvan University.
        </p>
      </header>

      {/* ── Embedded PDF Viewer ── */}
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

      {/* ── Official Syllabus Section ── */}
      <SyllabusSection subject={subjectRow.title} syllabus={syllabus} />

      {/* ── Examination Blueprint & Evaluation Scheme ── */}
      <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900 sm:p-8">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Examination Scheme &amp; Marks Distribution
          </h2>
        </div>

        <div className="grid gap-6 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:grid-cols-2">
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white">
              Evaluation Criteria
            </h3>
            <ul className="list-inside list-disc space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <strong>Final Board Theory Exam:</strong> 80 Marks (Pass mark: 32, Time: 3 Hours)
              </li>
              <li>
                <strong>Internal Assessment (Theory):</strong> 20 Marks (Pass mark: 8)
              </li>
              <li>
                <strong>Practical / Lab Exam:</strong> 25 or 50 Marks (Continuous assessment + viva)
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white">
              Exam Preparation Guidelines
            </h3>
            <ul className="list-inside list-disc space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <li>Review past question papers from 2078 to 2083 BS to understand recurring derivations.</li>
              <li>Practice numerical problems with clean step-by-step units and assumptions.</li>
              <li>Cross-reference answers with the official syllabus units and standard textbooks.</li>
            </ul>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="border-t border-slate-100 pt-6 dark:border-gray-800">
          <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
            <HelpCircle className="h-4 w-4 text-emerald-500" />
            Frequently Asked Questions ({subjectRow.title})
          </h3>
          <div className="mt-4 space-y-4 text-xs sm:text-sm">
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                Q: Are these official IOE past question papers?
              </p>
              <p className="mt-1 text-slate-500 dark:text-slate-400">
                Yes, all past question papers available on this portal are official examination papers issued by the Tribhuvan University, Institute of Engineering (IOE) Examination Control Division.
              </p>
            </div>
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                Q: Can I download the PDF for offline revision?
              </p>
              <p className="mt-1 text-slate-500 dark:text-slate-400">
                Yes, click the &quot;Download PDF&quot; button in the viewer above to save the complete original question paper file directly to your device.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Quick Trust Signals ── */}
      <section className="grid gap-3 rounded-2xl border border-slate-200/80 bg-slate-50 p-5 dark:border-gray-800/80 dark:bg-gray-900/50 sm:grid-cols-3 sm:p-6">
        {[
          { icon: CheckCircle2, text: "Official IOE / TU Exam Papers Only", color: "text-blue-600 dark:text-blue-400" },
          { icon: CheckCircle2, text: "Free Direct PDF Download", color: "text-emerald-600 dark:text-emerald-400" },
          { icon: CheckCircle2, text: "Complete Syllabus & Marking Scheme", color: "text-violet-600 dark:text-violet-400" },
        ].map(({ icon: Icon, text, color }) => (
          <div key={text} className="flex items-center gap-2.5 text-xs font-medium text-slate-700 dark:text-slate-300">
            <Icon className={`h-4 w-4 shrink-0 ${color}`} />
            {text}
          </div>
        ))}
      </section>
    </div>
  );
}