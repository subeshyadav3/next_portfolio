import Link from "next/link";
import { notFound } from "next/navigation";
import { IOE_ENABLED } from "@/lib/ioe/config";
import {
  countPapers,
  getAllPrograms,
  getCatalogs,
} from "@/lib/ioe/data";
import { buildIoeMetadata, collectionLd, jsonLd } from "@/lib/ioe/seo";
import { HeroSearch } from "@/components/ioe/HeroSearch";
import {
  GraduationCap,
  BookOpen,
  FileText,
  Layers,
  ArrowRight,
  Sparkles,
  Download,
  CheckCircle2,
  ChevronDown,
  Cpu,
  Building2,
  Zap,
  MoreHorizontal,
  Compass,
} from "lucide-react";

export const metadata = buildIoeMetadata({
  title: "IOE Past Question Papers & Syllabus Archive | TU Engineering PYQs PDF",
  description:
    "Free repository of IOE (Institute of Engineering, TU) past examination question papers (PYQs), curriculum syllabus, and exam preparation resources for BCT, BCE, BEX, and all engineering programs.",
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

const PROGRAM_CONFIG: Record<string, {
  bg: string; text: string; border: string;
  iconBg: string; icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}> = {
  BCT: {
    bg: "bg-blue-50 dark:bg-blue-950/40",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-900/50",
    iconBg: "bg-blue-100 dark:bg-blue-900/60",
    icon: Cpu,
    accentColor: "text-blue-600 dark:text-blue-400",
  },
  BCE: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-900/50",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/60",
    icon: Building2,
    accentColor: "text-emerald-600 dark:text-emerald-400",
  },
  BEX: {
    bg: "bg-violet-50 dark:bg-violet-950/40",
    text: "text-violet-700 dark:text-violet-300",
    border: "border-violet-200 dark:border-violet-900/50",
    iconBg: "bg-violet-100 dark:bg-violet-900/60",
    icon: Zap,
    accentColor: "text-violet-600 dark:text-violet-400",
  },
  BEI: {
    bg: "bg-violet-50 dark:bg-violet-950/40",
    text: "text-violet-700 dark:text-violet-300",
    border: "border-violet-200 dark:border-violet-900/50",
    iconBg: "bg-violet-100 dark:bg-violet-900/60",
    icon: Zap,
    accentColor: "text-violet-600 dark:text-violet-400",
  },
};

const FAQ_ITEMS = [
  {
    q: "Are these IOE past question papers free to download?",
    a: "Yes. The archived question papers on this portal are free to view and download through the available document links with no sign-ups or paywalls.",
  },
  {
    q: "Is this website officially affiliated with TU or IOE?",
    a: "No. IOE Papers is an independent educational portal created to help engineering students study and prepare for semester examinations. Course syllabi and exam formats follow the official TU/IOE curriculum standards.",
  },
  {
    q: "Which engineering programs are covered?",
    a: "We cover Computer (BCT), Civil (BCE), Electronics & Information (BEI/BEX), Electrical (BEL), Mechanical (BME), Automobile (BAE), Geomatics (BGE), Industrial (BIE), Chemical (BCH), Architecture (B.Arch), Agriculture (BAG), and Aerospace (BAS).",
  },
  {
    q: "How are the question papers organized?",
    a: "Papers are organized by program → semester → subject. You can also use the real-time search bar to find any subject directly, or browse the complete alphabetical archive.",
  },
  {
    q: "What should I do if the embedded PDF viewer does not load?",
    a: "If the embedded Google Drive preview is blocked or slow to load on your network, use the direct 'Download PDF' or 'Drive View' buttons on the subject page to access the original file directly.",
  },
  {
    q: "What is IOE under Tribhuvan University?",
    a: "IOE stands for Institute of Engineering under Tribhuvan University (TU), Nepal. It conducts Bachelor of Engineering (B.E.) examinations across constituent and affiliated engineering colleges in Nepal.",
  },
];

export default function IoeLandingPage() {
  if (!IOE_ENABLED) notFound();

  const programs = getAllPrograms();
  const subjects = getCatalogs();
  const total = countPapers();

  const searchItems = subjects.map((s) => ({
    name: s.name,
    papersCount: s.papers.length,
  }));

  const stats = [
    { label: "Engineering Disciplines", value: programs.length, icon: GraduationCap, colorClass: "bg-blue-600 text-white" },
    { label: "Curated Subjects", value: subjects.length, icon: BookOpen, colorClass: "bg-emerald-600 text-white" },
    { label: "Past Exam Papers", value: total, icon: FileText, colorClass: "bg-violet-600 text-white" },
    { label: "Semester Syllabi", value: programs.reduce((n, p) => n + Object.keys(p.semesters).length, 0), icon: Layers, colorClass: "bg-amber-500 text-white" },
  ];

  const items = programs.map((p) => ({
    name: p.fullName,
    path: `/ioe/${p.slug}`,
  }));

  const features = [
    { icon: FileText, label: "IOE Past Exam Papers (PDF)" },
    { icon: Download, label: "Free Direct PDF Download" },
    { icon: BookOpen, label: "Curriculum Syllabus Breakdown" },
    { icon: Sparkles, label: "Marking Schemes & Blueprint" },
  ];

  return (
    <div className="space-y-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            collectionLd(
              "IOE Past Question Papers",
              "Institute of Engineering (TU) past question papers by program and semester.",
              "/ioe",
              items
            )
          ),
        }}
      />

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-slate-50/50 p-6 sm:p-10 lg:p-14 shadow-sm dark:border-gray-800 dark:from-gray-900 dark:to-gray-950">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #64748b 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold text-blue-700 shadow-2xs dark:border-blue-900/50 dark:bg-blue-950/60 dark:text-blue-300">
            <Sparkles className="h-3.5 w-3.5" />
            Independent Resource · IOE / Tribhuvan University Engineering Archive
          </div>

          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl lg:leading-[1.12]">
            IOE Past Question Papers &amp; Syllabus
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-400">
            Comprehensive archive of Tribhuvan University engineering semester examination
            papers with built-in PDF preview, direct download links, and official course curriculum.
          </p>

          {/* Feature Pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {features.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-2xs dark:border-gray-700 dark:bg-gray-800 dark:text-slate-300"
              >
                <Icon className="h-3.5 w-3.5 text-blue-500" />
                {label}
              </span>
            ))}
          </div>

          {/* Search Bar with Autocomplete */}
          <div className="mx-auto mt-8 max-w-2xl">
            <HeroSearch subjects={searchItems} />
          </div>

          {/* Stats Grid */}
          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs dark:border-gray-800 dark:bg-gray-900/80"
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.colorClass} shadow-xs`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    {s.value}
                  </span>
                  <span className="text-center text-[11px] font-medium leading-tight text-slate-500 dark:text-slate-400">
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Engineering Programs Catalog ── */}
      <section className="space-y-6" aria-labelledby="programs-heading">
        <div className="flex flex-wrap items-end justify-between gap-2 border-b border-slate-200 dark:border-gray-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h2
                id="programs-heading"
                className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl"
              >
                Browse by Engineering Program
              </h2>
            </div>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Select your department to view subjects grouped by semester (1–8) or jump to a semester directly.
            </p>
          </div>
          <Link
            href="/ioe/all"
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
          >
            All {subjects.length} Subjects A–Z Archive <ArrowRight className="h-3 w-3" />
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
                className="group relative flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-500/40"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1 font-mono text-xs font-bold ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                      <ProgramIcon className="h-3.5 w-3.5" />
                      {program.code}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-gray-800 dark:text-slate-300">
                      {semesterKeys.length} Semesters
                    </span>
                  </div>

                  <Link href={`/ioe/${program.slug}`} className="block">
                    <h3 className="mt-4 text-base font-bold leading-snug text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                      {program.name}
                    </h3>
                  </Link>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    {program.description}
                  </p>

                  {/* Direct Semester Quick Jump Buttons */}
                  <div className="mt-4">
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                      Direct Semester Jump:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {semesterKeys.map((sem) => (
                        <Link
                          key={sem}
                          href={`/ioe/${program.slug}/semester/${sem}`}
                          className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700 transition-colors hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-slate-300 dark:hover:border-blue-500 dark:hover:bg-blue-950/40 dark:hover:text-blue-300"
                        >
                          Sem {sem}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-3.5 dark:border-gray-800">
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    {totalSubjectsInProgram} subjects total
                  </span>
                  <Link
                    href={`/ioe/${program.slug}`}
                    className={`inline-flex items-center gap-1 text-xs font-semibold transition-transform group-hover:translate-x-1 ${cfg.accentColor}`}
                  >
                    View Program Hub <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            );
          })}

          {/* Other Programs Tile */}
          <div className="group relative flex flex-col justify-between rounded-3xl border border-amber-200 bg-amber-50/40 p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-amber-400 hover:shadow-lg dark:border-amber-900/40 dark:bg-amber-950/15">
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-100/90 px-3 py-1 font-mono text-xs font-bold text-amber-800 dark:border-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                  SPECIALIZED
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100/80 px-2.5 py-0.5 text-[11px] font-medium text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                  9 Faculties
                </span>
              </div>

              <Link href="/ioe/other-programs" className="block">
                <h3 className="mt-4 text-base font-bold leading-snug text-slate-900 transition-colors group-hover:text-amber-600 dark:text-white dark:group-hover:text-amber-400">
                  Other Engineering Programs
                </h3>
              </Link>
              <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                Electrical, Mechanical, Automobile, Geomatics, Industrial, Architecture,
                Agriculture &amp; Aerospace past question papers.
              </p>

              <div className="mt-4">
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                  Faculties Included:
                </span>
                <div className="flex flex-wrap gap-1 text-[11px] text-slate-600 dark:text-slate-400">
                  <span className="rounded-lg bg-amber-100/70 dark:bg-amber-900/40 px-2 py-0.5 font-medium">BEL</span>
                  <span className="rounded-lg bg-amber-100/70 dark:bg-amber-900/40 px-2 py-0.5 font-medium">BME</span>
                  <span className="rounded-lg bg-amber-100/70 dark:bg-amber-900/40 px-2 py-0.5 font-medium">BAE</span>
                  <span className="rounded-lg bg-amber-100/70 dark:bg-amber-900/40 px-2 py-0.5 font-medium">BGE</span>
                  <span className="rounded-lg bg-amber-100/70 dark:bg-amber-900/40 px-2 py-0.5 font-medium">BIE</span>
                  <span className="rounded-lg bg-amber-100/70 dark:bg-amber-900/40 px-2 py-0.5 font-medium">B.Arch</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-amber-200/60 pt-3.5 dark:border-amber-900/40">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Drive Viewers &amp; PDF Links
              </span>
              <Link
                href="/ioe/other-programs"
                className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 transition-transform group-hover:translate-x-1 dark:text-amber-400"
              >
                Open Other Programs <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Use IOE Papers ── */}
      <section className="rounded-3xl border border-slate-200 bg-white px-6 py-10 shadow-xs dark:border-gray-800 dark:bg-gray-900 sm:px-10" aria-labelledby="why-heading">
        <h2 id="why-heading" className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
          Everything an Engineering Student Needs
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
          Built specifically to eliminate the stress of searching across dead links and fragmented Drive folders.
        </p>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: FileText,
              title: "Authentic Past Question Papers",
              desc: "Authentic IOE semester exam question papers compiled for revision and practice. Study the exact style of questions set in previous examinations.",
              color: "text-blue-600 dark:text-blue-400",
              bg: "bg-blue-50 dark:bg-blue-950/40",
            },
            {
              icon: Download,
              title: "Free Direct PDF Downloads",
              desc: "Archived papers are hosted and downloadable as PDFs for offline study and printing with zero paywalls.",
              color: "text-emerald-600 dark:text-emerald-400",
              bg: "bg-emerald-50 dark:bg-emerald-950/40",
            },
            {
              icon: BookOpen,
              title: "Official Syllabus Breakdowns",
              desc: "Unit topics, lecture hours, and curriculum source links help you structure a comprehensive semester study roadmap.",
              color: "text-violet-600 dark:text-violet-400",
              bg: "bg-violet-50 dark:bg-violet-950/40",
            },
            {
              icon: Sparkles,
              title: "Exam Schemes & Mark Allocations",
              desc: "Examination blueprint details, pass marks, internal vs board marks allocation, and subject-tailored preparation tips.",
              color: "text-amber-600 dark:text-amber-400",
              bg: "bg-amber-50 dark:bg-amber-950/40",
            },
            {
              icon: Layers,
              title: "All 8 Semesters Covered",
              desc: "From Semester 1 foundational engineering courses to Semester 8 specialized electives across disciplines.",
              color: "text-rose-600 dark:text-rose-400",
              bg: "bg-rose-50 dark:bg-rose-950/40",
            },
            {
              icon: GraduationCap,
              title: "Multiple Disciplines & Tracks",
              desc: "BCT, BCE, BEX, BEI, BEL, BME, and more disciplines with tailored course catalogs for every faculty.",
              color: "text-sky-600 dark:text-sky-400",
              bg: "bg-sky-50 dark:bg-sky-950/40",
            },
          ].map(({ icon: Icon, title, desc, color, bg }) => (
            <div
              key={title}
              className="flex gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5 dark:border-gray-800/80 dark:bg-gray-950/40"
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bg}`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works Walkthrough ── */}
      <section className="space-y-5" aria-labelledby="how-heading">
        <div>
          <h2 id="how-heading" className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
            How to Find Your Exam Papers
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Three simple ways to reach your required subject questions in seconds.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              step: "01",
              title: "Instant Search",
              desc: "Type any subject or topic into the search bar above. Matching subjects appear in real time for instant navigation.",
              action: { label: "Search Subjects ↑", href: "#" },
            },
            {
              step: "02",
              title: "Select Program & Semester",
              desc: "Choose your department above and click directly on your current semester number to open your subject list.",
              action: { label: "Choose Program", href: "#programs-heading" },
            },
            {
              step: "03",
              title: "Browse A–Z Archive",
              desc: "Open the complete alphabetical library of all subjects with letter-jump navigation and filter tags.",
              action: { label: "Open A–Z Archive", href: "/ioe/all" },
            },
          ].map(({ step, title, desc, action }) => (
            <div
              key={step}
              className="relative flex flex-col justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-gray-800/80 dark:bg-gray-900"
            >
              <div>
                <span className="font-mono text-3xl font-extrabold text-blue-600/30 dark:text-blue-400/30">
                  {step}
                </span>
                <h3 className="mt-2 text-sm font-bold text-slate-900 dark:text-white">{title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{desc}</p>
              </div>
              <Link
                href={action.href}
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400 pt-2"
              >
                {action.label} <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── Archive Callout Banner ── */}
      <section className="flex flex-col gap-4 rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 shadow-xs dark:border-blue-900/40 dark:from-blue-950/30 dark:to-indigo-950/30 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            <BookOpen className="h-3 w-3" />
            Complete Directory
          </div>
          <h3 className="mt-2 text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
            Looking for a specific subject across any department?
          </h3>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
            Browse the complete alphabetical index of all {subjects.length} IOE subjects with real-time live filtering.
          </p>
        </div>
        <Link
          href="/ioe/all"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm shadow-blue-500/20 transition-all hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          <BookOpen className="h-4 w-4" />
          Open Full Subjects Archive
        </Link>
      </section>

      {/* ── FAQ Section (SEO / Rich Snippets) ── */}
      <section className="space-y-5" aria-labelledby="faq-heading">
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
            className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl"
          >
            Frequently Asked Questions
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Common questions regarding IOE examination question formats and curriculum.
          </p>
        </div>

        <div className="divide-y divide-slate-200 rounded-3xl border border-slate-200 bg-white shadow-xs dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900">
          {FAQ_ITEMS.map(({ q, a }, i) => (
            <details key={i} className="group px-6 py-4.5">
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-sm font-semibold text-slate-900 marker:content-none hover:text-blue-600 dark:text-white dark:hover:text-blue-400">
                {q}
                <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180 dark:text-slate-500" />
              </summary>
              <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                {a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* ── Quick Trust Signals ── */}
      <section className="grid gap-3 rounded-2xl border border-slate-200/80 bg-slate-50 p-5 dark:border-gray-800/80 dark:bg-gray-900/50 sm:grid-cols-3 sm:p-6">
        {[
          { icon: CheckCircle2, text: "100% free — direct PDF download links", color: "text-emerald-600 dark:text-emerald-400" },
          { icon: CheckCircle2, text: "Authentic IOE / TU question papers", color: "text-blue-600 dark:text-blue-400" },
          { icon: CheckCircle2, text: "Curated for semester exam preparation", color: "text-violet-600 dark:text-violet-400" },
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
