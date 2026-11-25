import Link from "next/link";
import { notFound } from "next/navigation";
import { IOE_ENABLED } from "@/lib/ioe/config";
import {
  countPapers,
  findCatalogSubject,
  getAllPrograms,
  getCatalogs,
  getSubjectPrimaryPath,
  getSubjectPrograms,
} from "@/lib/ioe/data";
import { countSubjectsWithQuestionBank, hasQuestionBankForSubject } from "@/lib/ioe/server-helpers";
import { buildIoeMetadata, collectionLd, jsonLd } from "@/lib/ioe/seo";
import { HeroSearch, type SearchSubjectItem } from "@/components/ioe/HeroSearch";
import {
  ArrowRight,
  BookOpen,
  Building2,
  CheckCircle2,
  ChevronDown,
  Compass,
  Cpu,
  Download,
  FileText,
  Flame,
  GraduationCap,
  MoreHorizontal,
  Sparkles,
  Zap,
} from "lucide-react";

export const metadata = buildIoeMetadata({
  title: "IOE Past Question Papers & Syllabus Archive | TU Engineering PYQs PDF",
  description:
    "Free repository of IOE (Institute of Engineering, TU) past examination question papers (PYQs), chapter-wise question banks, curriculum syllabus, and PDFs for BCT, BCE, BEX, and all engineering programs.",
  path: "/ioe",
  keywords: [
    "IOE past question papers",
    "IOE PYQ",
    "IOE syllabus",
    "Tribhuvan University engineering PYQ",
    "IOE question bank PDF",
    "BCT past papers",
    "BCE past papers",
    "BEX past papers",
    "IOE notes PDF",
  ],
});

const PROGRAM_CONFIG: Record<
  string,
  {
    bg: string;
    text: string;
    border: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
  }
> = {
  BCT: {
    bg: "bg-blue-50 dark:bg-blue-950/40",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-900/50",
    icon: Cpu,
    accentColor: "text-blue-600 dark:text-blue-400",
  },
  BCE: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-900/50",
    icon: Building2,
    accentColor: "text-emerald-600 dark:text-emerald-400",
  },
  BEX: {
    bg: "bg-violet-50 dark:bg-violet-950/40",
    text: "text-violet-700 dark:text-violet-300",
    border: "border-violet-200 dark:border-violet-900/50",
    icon: Zap,
    accentColor: "text-violet-600 dark:text-violet-400",
  },
  BEI: {
    bg: "bg-violet-50 dark:bg-violet-950/40",
    text: "text-violet-700 dark:text-violet-300",
    border: "border-violet-200 dark:border-violet-900/50",
    icon: Zap,
    accentColor: "text-violet-600 dark:text-violet-400",
  },
};

const FEATURED_SUBJECT_NAMES = [
  "Engineering Mathematics I",
  "Engineering Mathematics II",
  "Engineering Mathematics III",
  "Engineering Physics",
  "Applied Mechanics",
  "Computer Programming",
  "Data Structure and Algorithm",
  "Fluid Mechanics",
];

const FAQ_ITEMS = [
  {
    q: "Are these IOE past question papers free to download?",
    a: "Yes. All archived question papers, chapter-wise question banks, and year-wise papers are free to browse and download with no sign-ups or paywalls.",
  },
  {
    q: "Is this website officially affiliated with TU or IOE?",
    a: "No. IOE Papers is an independent educational portal created to help engineering students prepare for semester examinations. Course syllabi and exam formats follow official TU/IOE curriculum standards.",
  },
  {
    q: "Which engineering programs are covered?",
    a: "We cover Computer (BCT), Civil (BCE), Electronics & Information (BEX/BEI), plus Electrical (BEL), Mechanical (BME), Automobile (BAE), Geomatics (BGE), Industrial (BIE), Chemical (BCH), Architecture (B.Arch), Agriculture (BAG), and Aerospace (BAS).",
  },
  {
    q: "How are chapter-wise and year-wise questions organized?",
    a: "On supported subject pages, you can switch between Chapter Questions (sorted by repeat frequency), Year-wise Papers (Regular and Back exam sessions), PDF Papers, Official Syllabus, and Exam Scheme.",
  },
  {
    q: "What should I do if the embedded PDF viewer does not load?",
    a: "Use the 'Download' or 'Drive' button above any embedded PDF viewer to open or save the file directly.",
  },
];

export default function IoeLandingPage() {
  if (!IOE_ENABLED) notFound();

  const programs = getAllPrograms();
  const subjects = getCatalogs();
  const totalPapers = countPapers();
  const questionBankCount = countSubjectsWithQuestionBank();

  const searchItems: SearchSubjectItem[] = subjects.map((s) => {
    const progs = getSubjectPrograms(s.name);
    return {
      name: s.name,
      papersCount: s.papers.length,
      primaryPath: getSubjectPrimaryPath(s.name),
      hasQuestionBank: hasQuestionBankForSubject(s.name),
      programs: progs.map((p) => `${p.code} S${p.semester}`),
    };
  });

  const featuredSubjects = FEATURED_SUBJECT_NAMES.map((name) => {
    const catalog = findCatalogSubject(name);
    if (!catalog) return null;
    const progs = getSubjectPrograms(catalog.name);
    return {
      name: catalog.name,
      papersCount: catalog.papers.length,
      href: getSubjectPrimaryPath(catalog.name),
      hasQuestionBank: hasQuestionBankForSubject(catalog.name),
      tag: progs[0] ? `${progs[0].code} · Sem ${progs[0].semester}` : "Archive",
    };
  }).filter((item): item is NonNullable<typeof item> => item !== null);

  const stats = [
    {
      label: "Core Programs",
      value: programs.length,
      icon: GraduationCap,
      colorClass: "bg-blue-600 text-white",
    },
    {
      label: "Curated Subjects",
      value: subjects.length,
      icon: BookOpen,
      colorClass: "bg-emerald-600 text-white",
    },
    {
      label: "Past Paper PDFs",
      value: totalPapers,
      icon: FileText,
      colorClass: "bg-violet-600 text-white",
    },
    {
      label: "PYQ Question Banks",
      value: questionBankCount,
      icon: Flame,
      colorClass: "bg-amber-500 text-white",
    },
  ];

  const ldItems = programs.map((p) => ({
    name: p.fullName,
    path: `/ioe/${p.slug}`,
  }));

  const features = [
    { icon: Flame, label: "Chapter & Year-wise PYQs" },
    { icon: FileText, label: "Embedded PDF Papers" },
    { icon: Download, label: "Direct PDF Downloads" },
    { icon: BookOpen, label: "Official Syllabus Units" },
  ];

  return (
    <div className="space-y-12 sm:space-y-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            collectionLd(
              "IOE Past Question Papers",
              "Institute of Engineering (TU) past question papers by program and semester.",
              "/ioe",
              ldItems
            )
          ),
        }}
      />

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-gray-800/90 dark:bg-gray-900 sm:p-10 lg:p-12">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-50/90 via-white to-slate-50/60 dark:from-blue-950/30 dark:via-gray-900 dark:to-gray-950" />

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/60 dark:text-blue-300">
            <Sparkles className="h-3.5 w-3.5" />
            IOE / Tribhuvan University Study Workspace
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:leading-[1.12]">
            IOE Past Papers, Chapter PYQs &amp; Syllabus
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
            Study chapter-wise repeated questions, year-wise exam papers, built-in PDFs, and
            official TU curriculum topics in one unified workspace.
          </p>

          {/* Feature Pills */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {features.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-white/90 px-3 py-1 text-xs font-medium text-slate-600 shadow-2xs dark:border-gray-700/80 dark:bg-gray-800/80 dark:text-slate-300"
              >
                <Icon className="h-3.5 w-3.5 text-blue-500" />
                {label}
              </span>
            ))}
          </div>

          {/* Search Bar */}
          <div className="mx-auto mt-7 max-w-2xl">
            <HeroSearch subjects={searchItems} />
          </div>

          {/* Stats Strip */}
          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  className="flex flex-col items-center gap-1.5 rounded-2xl border border-slate-200/90 bg-white/90 p-3.5 shadow-2xs dark:border-gray-800 dark:bg-gray-900/80"
                >
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${s.colorClass} shadow-xs`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                    {s.value}
                  </span>
                  <span className="text-center text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Engineering Programs Catalog ── */}
      <section className="space-y-5" aria-labelledby="programs-heading">
        <div className="flex flex-wrap items-end justify-between gap-2 border-b border-slate-200/80 pb-3 dark:border-gray-800">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h2
                id="programs-heading"
                className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl"
              >
                Browse by Engineering Program
              </h2>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
              Jump directly to any semester (1–8) or explore the full program curriculum.
            </p>
          </div>
          <Link
            href="/ioe/all"
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
          >
            All {subjects.length} Subjects A–Z <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => {
            const semesterKeys = Object.keys(program.semesters);
            const totalSubjectsInProgram = Object.values(program.semesters).flat().length;
            const cfg = PROGRAM_CONFIG[program.code] ?? PROGRAM_CONFIG.BCT;
            const ProgramIcon = cfg.icon;

            return (
              <div
                key={program.code}
                className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:border-gray-800/90 dark:bg-gray-900 dark:hover:border-blue-500/40"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1 font-mono text-xs font-bold ${cfg.bg} ${cfg.text} ${cfg.border}`}
                    >
                      <ProgramIcon className="h-3.5 w-3.5" />
                      {program.code}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-gray-800 dark:text-slate-300">
                      {semesterKeys.length} Semesters
                    </span>
                  </div>

                  <Link href={`/ioe/${program.slug}`} className="block">
                    <h3 className="mt-4 text-base font-bold leading-snug text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                      {program.name}
                    </h3>
                  </Link>
                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    {program.description}
                  </p>

                  {/* Direct Semester Quick Jump */}
                  <div className="mt-4">
                    <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Jump to Semester
                    </span>
                    <div className="grid grid-cols-4 gap-1.5">
                      {semesterKeys.map((sem) => (
                        <Link
                          key={sem}
                          href={`/ioe/${program.slug}/semester/${sem}`}
                          className="rounded-lg border border-slate-200/90 bg-slate-50 py-1.5 text-center font-mono text-[11px] font-semibold text-slate-700 transition-colors hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 dark:border-gray-700/80 dark:bg-gray-800 dark:text-slate-300 dark:hover:border-blue-500 dark:hover:bg-blue-950/50 dark:hover:text-blue-300"
                        >
                          S{sem}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3.5 dark:border-gray-800">
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    {totalSubjectsInProgram} courses
                  </span>
                  <Link
                    href={`/ioe/${program.slug}`}
                    className={`inline-flex items-center gap-1 text-xs font-bold transition-transform group-hover:translate-x-0.5 ${cfg.accentColor}`}
                  >
                    Open Curriculum <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}

          {/* Other Programs Tile */}
          <div className="group relative flex flex-col justify-between rounded-3xl border border-amber-200/90 bg-amber-50/40 p-6 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-400 hover:shadow-md dark:border-amber-900/40 dark:bg-amber-950/15">
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-100/90 px-3 py-1 font-mono text-xs font-bold text-amber-800 dark:border-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                  OTHER
                </span>
                <span className="rounded-full bg-amber-100/80 px-2.5 py-0.5 text-[11px] font-medium text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                  9 Faculties
                </span>
              </div>

              <Link href="/ioe/other-programs" className="block">
                <h3 className="mt-4 text-base font-bold leading-snug text-slate-900 transition-colors group-hover:text-amber-600 dark:text-white dark:group-hover:text-amber-400">
                  Other Engineering Programs
                </h3>
              </Link>
              <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                Electrical, Mechanical, Automobile, Geomatics, Industrial, Architecture, Agriculture
                &amp; Aerospace question papers.
              </p>

              <div className="mt-4">
                <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Faculties Included
                </span>
                <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-700 dark:text-slate-300">
                  {["BEL", "BME", "BAE", "BGE", "BIE", "B.Arch", "BCH", "BAG", "BAS"].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg bg-amber-100/70 px-2 py-0.5 font-mono text-[10px] font-semibold dark:bg-amber-900/40"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-amber-200/60 pt-3.5 dark:border-amber-900/40">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                PDF Viewers &amp; Archive
              </span>
              <Link
                href="/ioe/other-programs"
                className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 transition-transform group-hover:translate-x-0.5 dark:text-amber-400"
              >
                Explore Faculties <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Study Hubs ── */}
      {featuredSubjects.length > 0 && (
        <section className="space-y-5" aria-labelledby="featured-heading">
          <div className="flex flex-wrap items-end justify-between gap-2 border-b border-slate-200/80 pb-3 dark:border-gray-800">
            <div>
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-amber-500" />
                <h2
                  id="featured-heading"
                  className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl"
                >
                  Popular Subject Study Hubs
                </h2>
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                Direct access to high-traffic subjects with chapter-wise PYQs, year-wise papers, and PDFs.
              </p>
            </div>
            <Link
              href="/ioe/all"
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
            >
              Browse All {subjects.length} Subjects <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredSubjects.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:border-gray-800/90 dark:bg-gray-900 dark:hover:border-blue-500/50"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-600 dark:bg-gray-800 dark:text-slate-300">
                      {item.tag}
                    </span>
                    {item.hasQuestionBank && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                        <Flame className="h-2.5 w-2.5" />
                        PYQ Bank
                      </span>
                    )}
                  </div>
                  <h3 className="mt-3 text-sm font-bold leading-snug text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                    {item.name}
                  </h3>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-2.5 text-[11px] dark:border-gray-800">
                  <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400">
                    <FileText className="h-3 w-3" />
                    {item.papersCount} {item.papersCount === 1 ? "paper" : "papers"}
                  </span>
                  <span className="inline-flex items-center gap-0.5 font-semibold text-blue-600 dark:text-blue-400">
                    Study <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Quick Study Workflow & FAQ ── */}
      <section className="grid gap-6 lg:grid-cols-5" aria-labelledby="faq-heading">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: FAQ_ITEMS.map(({ q, a }) => ({
                "@type": "Question",
                name: q,
                acceptedAnswer: { "@type": "Answer", text: a },
              })),
            }),
          }}
        />

        {/* Quick 3-Step Guide */}
        <div className="space-y-4 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-gray-800/90 dark:bg-gray-900 lg:col-span-2">
          <h2 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
            How to Study Smarter
          </h2>
          <div className="space-y-4">
            {[
              {
                step: "01",
                title: "Find Your Subject",
                desc: "Use instant search above, pick your semester under BCT/BCE/BEX, or browse the A–Z directory.",
              },
              {
                step: "02",
                title: "Focus on High-Repeat PYQs",
                desc: "Filter questions by chapter and repeat frequency to spot high-weightage exam topics fast.",
              },
              {
                step: "03",
                title: "Practice Full Exam Papers",
                desc: "Switch to Year-wise Papers or open the embedded PDF viewer for authentic board exam sets.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-3.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 font-mono text-xs font-extrabold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                  {item.step}
                </span>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white sm:text-sm">
                    {item.title}
                  </h3>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-4 dark:border-gray-800">
            <Link
              href="/ioe/all"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs shadow-blue-500/20 transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              <BookOpen className="h-4 w-4" />
              Browse Complete A–Z Archive
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <div className="space-y-4 lg:col-span-3">
          <div>
            <h2
              id="faq-heading"
              className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-xl"
            >
              Frequently Asked Questions
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Common questions about IOE past papers, syllabus coverage, and downloads.
            </p>
          </div>

          <div className="divide-y divide-slate-200 rounded-3xl border border-slate-200/90 bg-white shadow-xs dark:divide-gray-800 dark:border-gray-800/90 dark:bg-gray-900">
            {FAQ_ITEMS.map(({ q, a }, i) => (
              <details key={i} className="group px-5 py-4">
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-xs font-semibold text-slate-900 marker:content-none hover:text-blue-600 dark:text-white dark:hover:text-blue-400 sm:text-sm">
                  {q}
                  <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180 dark:text-slate-500" />
                </summary>
                <p className="mt-2.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  {a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quick Trust Signals ── */}
      <section className="grid gap-3 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-gray-800/80 dark:bg-gray-900/70 sm:grid-cols-3 sm:p-6">
        {[
          {
            icon: CheckCircle2,
            text: "100% free — direct PDF downloads",
            color: "text-emerald-600 dark:text-emerald-400",
          },
          {
            icon: CheckCircle2,
            text: "Authentic IOE / TU past exam papers",
            color: "text-blue-600 dark:text-blue-400",
          },
          {
            icon: CheckCircle2,
            text: "Chapter-wise, year-wise & syllabus views",
            color: "text-violet-600 dark:text-violet-400",
          },
        ].map(({ icon: Icon, text, color }) => (
          <div
            key={text}
            className="flex items-center gap-2.5 text-xs font-medium text-slate-700 dark:text-slate-300"
          >
            <Icon className={`h-4 w-4 shrink-0 ${color}`} />
            {text}
          </div>
        ))}
      </section>
    </div>
  );
}
