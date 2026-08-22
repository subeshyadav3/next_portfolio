import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { IOE_ENABLED } from "@/lib/ioe/config";
import {
  findCatalogSubject,
  getAllPrograms,
  getPapersForSubject,
  getSyllabusForSubject,
  getAssessmentScheme,
  getSubjectPrimaryPath,
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
    title: `${subjectRow.title} IOE PYQ Past Year Questions & Syllabus PDF`,
     description: `Browse ${subjectRow.title} (${subjectRow.code}) IOE past year question papers (PYQ PDF) for ${program.fullName} Semester ${semester}, with a curriculum syllabus breakdown and archive source details.`,
    path: getSubjectPrimaryPath(subjectRow.title),
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

  const primaryPath = getSubjectPrimaryPath(subjectRow.title);
  if (primaryPath !== `/ioe/${programSlug}/semester/${semester}/${subjectSlug}`) {
    redirect(primaryPath);
  }

  const syllabus = getSyllabusForSubject(subjectRow.title);
  const assessment = getAssessmentScheme(subjectRow.title);
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
          "text": `You can preview or download ${subjectRow.title} past question papers (PDF) directly using the built-in PDF viewer on this page with zero redirects or paywalls.`
        }
      },
      {
        "@type": "Question",
        "name": `What is the examination scheme for ${subjectRow.title} (${subjectRow.code})?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The general current IOE scheme uses a 60-mark final theory exam and 40-mark internal assessment, with pass marks of 24 and 16. Course-specific practical and project evaluation may differ, so students should verify the available syllabus.`
        }
      }
    ]
  };

  const titleLower = subjectRow.title.toLowerCase();
  const isDrawing = titleLower.includes("drawing");
  const isProject = titleLower.includes("project") || titleLower.includes("thesis");
  const isMathOrNumerical = titleLower.includes("math") || titleLower.includes("numerical") || titleLower.includes("mechanics") || titleLower.includes("calculus") || titleLower.includes("statistics");
  const isSoftwareOrCS = titleLower.includes("programming") || titleLower.includes("software") || titleLower.includes("algorithm") || titleLower.includes("data structure") || titleLower.includes("database");
  const isElectricalOrElectronics = titleLower.includes("electrical") || titleLower.includes("electronic") || titleLower.includes("circuit") || titleLower.includes("signal") || titleLower.includes("telecommunication");
  const isCivil = titleLower.includes("survey") || titleLower.includes("hydraulics") || titleLower.includes("structural") || titleLower.includes("concrete") || titleLower.includes("transportation");

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
          Past examination question papers and complete curriculum syllabus for {subjectRow.title} ({subjectRow.code}), {program.fullName} Semester {semester} under Institute of Engineering (IOE), Tribhuvan University.
        </p>
      </header>

      {/* ── Embedded PDF Viewer ── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Past Question Papers (PDF)
          </h2>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            Switch tabs to view different exam papers
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
              Evaluation Structure
            </h3>
            {isProject ? (
              <ul className="list-inside list-disc space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <li><strong>Internal Project Assessment:</strong> Progress defense, supervisor review, and milestone logs.</li>
                <li><strong>Final Evaluation &amp; Viva:</strong> External defense, technical report submission, and viva-voce.</li>
              </ul>
            ) : isDrawing ? (
              <ul className="list-inside list-disc space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <li><strong>Final Board Drawing Exam:</strong> {assessment.theory} Marks (Pass mark: {assessment.passTheory})</li>
                <li><strong>Internal Sheet Assessment:</strong> {assessment.internal} Marks (Continuous drafting sheets + class assignments)</li>
                <li><strong>Viva / Practical:</strong> Practical drawing exam and viva assessment.</li>
              </ul>
            ) : (
              <ul className="list-inside list-disc space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <li><strong>Final Board Theory Exam:</strong> {assessment.theory} Marks (Pass mark: {assessment.passTheory})</li>
                <li><strong>Internal Assessment:</strong> {assessment.internal} Marks (Pass mark: {assessment.passInternal})</li>
                <li><strong>Practical / Lab Exam:</strong> 25 or 50 Marks (Continuous lab evaluation + viva, where applicable)</li>
              </ul>
            )}
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              * {assessment.source === "syllabus" ? "Marks were extracted from the available curriculum syllabus." : "This is the general current IOE 60/40 scheme; verify course-specific details in the syllabus above."}
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white">
              Exam Preparation Guidelines
            </h3>
            <ul className="list-inside list-disc space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <li>
                {papers.length === 1
                  ? "Review the available past examination paper to understand question styling, typical derivation topics, and marks allocation."
                  : `Review the ${papers.length} available past examination papers to identify recurring patterns, core problem types, and chapter weightage.`}
              </li>
              <li>
                {isMathOrNumerical
                  ? "Practice numerical problems step-by-step with clean formula derivations, clear units, and standard assumptions."
                  : isSoftwareOrCS
                  ? "Practice writing clean algorithms and code implementations, tracing dry runs with sample inputs, and explaining complexity trade-offs."
                  : isDrawing
                  ? "Practice standard projection methods, isometric views, line conventions, and neat dimensioning with proper drawing instruments."
                  : isElectricalOrElectronics
                  ? "Practice drawing labeled circuit schematics, deriving transfer functions, and showing systematic mathematical steps."
                  : isCivil
                  ? "Practice design calculations, standard code provisions, and illustrative cross-section sketches."
                  : "Cross-reference key answers with official syllabus units, standard textbooks, and lecture notes."}
              </li>
              <li>Structure answers with labeled diagrams, concise bullet points, and highlight final answers in numerical solutions.</li>
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
                Q: How can I download {subjectRow.title} past question papers?
              </p>
              <p className="mt-1 text-slate-500 dark:text-slate-400">
                You can preview or download the {subjectRow.title} question papers (PDF) directly using the built-in viewer on this page with zero redirects or paywalls.
              </p>
            </div>
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                Q: What is the pass mark for {subjectRow.title}?
              </p>
              <p className="mt-1 text-slate-500 dark:text-slate-400">
                The general current scheme is a {assessment.theory}-mark final theory exam and a {assessment.internal}-mark internal assessment, with pass marks of {assessment.passTheory} and {assessment.passInternal}. Verify the course-specific syllabus above.
              </p>
            </div>
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                Q: Where can I find the complete syllabus for this subject?
              </p>
              <p className="mt-1 text-slate-500 dark:text-slate-400">
                 The available chapter-wise syllabus and topic breakdown is indexed in the Syllabus section above, with links to the curriculum PDF source.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Quick Trust Signals ── */}
      <section className="grid gap-3 rounded-2xl border border-slate-200/80 bg-slate-50 p-5 dark:border-gray-800/80 dark:bg-gray-900/50 sm:grid-cols-3 sm:p-6">
        {[
          { icon: CheckCircle2, text: "Authentic IOE Past Papers", color: "text-blue-600 dark:text-blue-400" },
          { icon: CheckCircle2, text: "Free Direct PDF Download", color: "text-emerald-600 dark:text-emerald-400" },
          { icon: CheckCircle2, text: "Curriculum Syllabus & Marking Scheme", color: "text-violet-600 dark:text-violet-400" },
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
