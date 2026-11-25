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
import {
  countSubjectsWithQuestionBank,
  hasQuestionBankForSubject,
} from "@/lib/ioe/server-helpers";
import { buildIoeMetadata, collectionLd, jsonLd } from "@/lib/ioe/seo";
import { HeroSearch, type SearchSubjectItem } from "@/components/ioe/HeroSearch";
import { IoeQuickLauncher, type QuickProgramData } from "@/components/ioe/IoeQuickLauncher";
import otherProgramsData from "@/data/ioe/other-programs.json";
import {
  ArrowRight,
  Award,
  BookOpen,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Compass,
  Cpu,
  FileText,
  Flame,
  GraduationCap,
  Library,
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
    a: "On supported subject pages, switch seamlessly between Chapter Questions (sorted by repeat frequency), Year-wise Papers (Regular and Back sessions), PDF Papers, Official Syllabus units, and Exam Scheme.",
  },
  {
    q: "What should I do if the embedded PDF viewer does not load?",
    a: "Use the 'Download' or 'Drive' button on any paper viewer to open or save the file directly.",
  },
];

export default function IoeLandingPage() {
  if (!IOE_ENABLED) notFound();

  const programs = getAllPrograms();
  const subjects = getCatalogs();
  const totalPapers = countPapers();
  const questionBankCount = countSubjectsWithQuestionBank();

  const coreSubjectNames = new Set<string>();
  for (const prog of programs) {
    for (const semList of Object.values(prog.semesters)) {
      for (const sub of semList) {
        coreSubjectNames.add(sub.title.trim().toLowerCase());
      }
    }
  }
  const otherSubjectsCount = subjects.filter(
    (s) => !coreSubjectNames.has(s.name.trim().toLowerCase())
  ).length;

  const quickPrograms: QuickProgramData[] = programs.map((program) => {
    const entries = Object.entries(program.semesters);
    const allSubs = entries.flatMap(([, list]) => list);
    const uniquePyq = new Set(
      allSubs.filter((s) => hasQuestionBankForSubject(s.title)).map((s) => s.title)
    );
    return {
      code: program.code,
      name: program.name,
      slug: program.slug,
      fullName: program.fullName,
      totalSubjects: allSubs.length,
      pyqCount: uniquePyq.size,
      semesters: entries.map(([sem, list]) => ({
        sem,
        subjectCount: list.length,
      })),
    };
  });

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

  const ldItems = programs.map((p) => ({
    name: p.fullName,
    path: `/ioe/${p.slug}`,
  }));

  return (
    <div className="space-y-10 sm:space-y-14">
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

      {/* ── Hero + Interactive Quick Launcher ── */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-gray-800/90 dark:bg-gray-900 sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-50/90 via-white to-slate-50/50 dark:from-blue-950/30 dark:via-gray-900 dark:to-gray-950" />

        <div className="relative grid items-center gap-7 lg:grid-cols-[1.15fr_0.85fr] lg:gap-9">
          {/* Left: Headline + Search + Stats */}
          <div className="space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/60 dark:text-blue-300">
              <Sparkles className="h-3.5 w-3.5" />
              TU / IOE Engineering Exam Workspace
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl lg:leading-[1.1]">
              Past Papers, Chapter PYQs &amp; Syllabus
            </h1>

            <p className="mx-auto max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base lg:mx-0">
              Prepare faster for IOE semester exams with repeat-ranked chapter questions, year-wise
              board papers, embedded PDFs, and syllabus topics in one clean workspace.
            </p>

            {/* Instant Search */}
            <div className="lg:max-w-xl">
              <HeroSearch subjects={searchItems} />
            </div>

            {/* Compact Live Metrics */}
            <div className="grid grid-cols-2 gap-2.5 pt-1 sm:grid-cols-4">
              {[
                {
                  label: "Faculties",
                  value: `${programs.length + otherProgramsData.programs.length}`,
                  icon: GraduationCap,
                  cls: "text-blue-600 dark:text-blue-400",
                },
                {
                  label: "Subjects",
                  value: `${subjects.length}`,
                  icon: BookOpen,
                  cls: "text-emerald-600 dark:text-emerald-400",
                },
                {
                  label: "Past PDFs",
                  value: `${totalPapers}`,
                  icon: FileText,
                  cls: "text-violet-600 dark:text-violet-400",
                },
                {
                  label: "PYQ Banks",
                  value: `${questionBankCount}`,
                  icon: Flame,
                  cls: "text-amber-600 dark:text-amber-400",
                },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white/80 px-3 py-2.5 text-left shadow-2xs dark:border-gray-800 dark:bg-gray-900/70"
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${stat.cls}`} />
                    <div className="min-w-0 leading-tight">
                      <span className="block text-sm font-extrabold text-slate-900 dark:text-white sm:text-base">
                        {stat.value}
                      </span>
                      <span className="block truncate text-[10px] font-medium text-slate-500 dark:text-slate-400">
                        {stat.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Interactive Quick Semester Launcher */}
          <IoeQuickLauncher
            programs={quickPrograms}
            otherSubjectsCount={otherSubjectsCount}
            otherFacultiesCount={otherProgramsData.programs.length}
          />
        </div>
      </section>

      {/* ── Popular Subject Study Hubs ── */}
      {featuredSubjects.length > 0 && (
        <section className="space-y-4" aria-labelledby="featured-heading">
          <div className="flex flex-wrap items-end justify-between gap-2 border-b border-slate-200/80 pb-3 dark:border-gray-800">
            <div>
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-amber-500" />
                <h2
                  id="featured-heading"
                  className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl"
                >
                  Popular Subject Study Hubs
                </h2>
              </div>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                Jump straight into high-traffic subjects with chapter &amp; year-wise PYQs.
              </p>
            </div>
            <Link
              href="/ioe/all"
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline dark:text-blue-400"
            >
              All {subjects.length} Subjects <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
                  <h3 className="mt-2.5 text-sm font-bold leading-snug text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                    {item.name}
                  </h3>
                </div>

                <div className="mt-3.5 flex items-center justify-between border-t border-slate-100 pt-2.5 text-[11px] dark:border-gray-800">
                  <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400">
                    <FileText className="h-3 w-3" />
                    {item.papersCount} {item.papersCount === 1 ? "paper" : "papers"}
                  </span>
                  <span className="inline-flex items-center gap-0.5 font-bold text-blue-600 dark:text-blue-400">
                    Study <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Inside Every Subject Workspace ── */}
      <section className="space-y-4" aria-labelledby="workspace-heading">
        <div>
          <h2
            id="workspace-heading"
            className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl"
          >
            Built for Focused Exam Preparation
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
            Every subject page organizes everything you need into clean tabs—no hunting through folders.
          </p>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Flame,
              title: "Chapter Frequency Bank",
              desc: "Filter questions by syllabus chapter and spot high-repeat exam topics instantly.",
              color: "text-amber-600 dark:text-amber-400",
              bg: "bg-amber-50 dark:bg-amber-950/50",
            },
            {
              icon: Calendar,
              title: "Year-wise Exam Sets",
              desc: "Practice Regular and Back board exam papers organized by B.S. exam session.",
              color: "text-emerald-600 dark:text-emerald-400",
              bg: "bg-emerald-50 dark:bg-emerald-950/50",
            },
            {
              icon: FileText,
              title: "Built-in PDF Papers",
              desc: "Preview original scanned papers in-page, open full screen, or download with 1 tap.",
              color: "text-blue-600 dark:text-blue-400",
              bg: "bg-blue-50 dark:bg-blue-950/50",
            },
            {
              icon: Award,
              title: "Syllabus & 60/40 Scheme",
              desc: "Unit-by-unit course topics, lecture hours, and marks distribution right beside PYQs.",
              color: "text-violet-600 dark:text-violet-400",
              bg: "bg-violet-50 dark:bg-violet-950/50",
            },
          ].map(({ icon: Icon, title, desc, color, bg }) => (
            <div
              key={title}
              className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-gray-800/90 dark:bg-gray-900"
            >
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <h3 className="mt-3.5 text-sm font-bold text-slate-900 dark:text-white">{title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Engineering Programs Directory ── */}
      <section className="space-y-4" aria-labelledby="programs-heading">
        <div className="flex flex-wrap items-end justify-between gap-2 border-b border-slate-200/80 pb-3 dark:border-gray-800">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h2
                id="programs-heading"
                className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl"
              >
                All Engineering Programs
              </h2>
            </div>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
              Full semester-wise curricula for BCT, BCE, BEX, and 9 specialized faculties.
            </p>
          </div>
          <Link
            href="/ioe/other-programs"
            className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:underline dark:text-amber-400"
          >
            Other 9 Faculties <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((program, idx) => {
            const semesterKeys = Object.keys(program.semesters);
            const qp = quickPrograms[idx];
            const cfg = PROGRAM_CONFIG[program.code] ?? PROGRAM_CONFIG.BCT;
            const ProgramIcon = cfg.icon;

            return (
              <div
                key={program.code}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:border-gray-800/90 dark:bg-gray-900 dark:hover:border-blue-500/40"
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
                      {qp.pyqCount} PYQ Banks
                    </span>
                  </div>

                  <Link href={`/ioe/${program.slug}`} className="block">
                    <h3 className="mt-3.5 text-base font-bold leading-snug text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                      {program.name}
                    </h3>
                  </Link>
                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    {program.description}
                  </p>

                  <div className="mt-4 grid grid-cols-4 gap-1.5">
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

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3.5 dark:border-gray-800">
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    {qp.totalSubjects} courses
                  </span>
                  <Link
                    href={`/ioe/${program.slug}`}
                    className={`inline-flex items-center gap-1 text-xs font-bold transition-transform group-hover:translate-x-0.5 ${cfg.accentColor}`}
                  >
                    Open Hub <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Full-width Other Faculties + A-Z Archive Strip */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/ioe/other-programs"
            className="group flex items-center justify-between gap-4 rounded-2xl border border-amber-200/90 bg-amber-50/50 p-5 shadow-xs transition hover:-translate-y-0.5 hover:border-amber-400 hover:shadow-md dark:border-amber-900/40 dark:bg-amber-950/20"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-lg bg-amber-100 px-2.5 py-0.5 font-mono text-[11px] font-bold text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                  9 FACULTIES
                </span>
              </div>
              <h3 className="mt-2.5 text-sm font-bold text-slate-900 group-hover:text-amber-700 dark:text-white dark:group-hover:text-amber-300 sm:text-base">
                Electrical, Mechanical, Architecture &amp; More
              </h3>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                BEL, BME, BAE, BGE, BIE, B.Arch, BCH, BAG, and BAS papers ({otherSubjectsCount} subjects).
              </p>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-amber-600 transition-transform group-hover:translate-x-1 dark:text-amber-400" />
          </Link>

          <Link
            href="/ioe/all"
            className="group flex items-center justify-between gap-4 rounded-2xl border border-blue-200/90 bg-blue-50/50 p-5 shadow-xs transition hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-md dark:border-blue-900/40 dark:bg-blue-950/20"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-lg bg-blue-100 px-2.5 py-0.5 font-mono text-[11px] font-bold text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                  <Library className="h-3.5 w-3.5" />
                  A–Z INDEX
                </span>
              </div>
              <h3 className="mt-2.5 text-sm font-bold text-slate-900 group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-300 sm:text-base">
                Complete {subjects.length} Subjects Directory
              </h3>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                Filter every archived subject by faculty, A–Z letter, or PYQ question bank status.
              </p>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-blue-600 transition-transform group-hover:translate-x-1 dark:text-blue-400" />
          </Link>
        </div>
      </section>

      {/* ── FAQ & Trust Signals ── */}
      <section className="space-y-4" aria-labelledby="faq-heading">
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

        <div>
          <h2
            id="faq-heading"
            className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-xl"
          >
            Frequently Asked Questions
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Quick answers about IOE past papers, syllabus coverage, and downloads.
          </p>
        </div>

        <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200/90 bg-white shadow-xs dark:divide-gray-800 dark:border-gray-800/90 dark:bg-gray-900">
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

        <div className="grid gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-gray-800/80 dark:bg-gray-900/70 sm:grid-cols-3 sm:p-5">
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
        </div>
      </section>
    </div>
  );
}
