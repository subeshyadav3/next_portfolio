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
} from "lucide-react";

export const metadata = buildIoeMetadata({
  title: "IOE Past Question Papers & Solutions | TU Engineering PYQs",
  description:
    "Free IOE (Institute of Engineering, TU) past question papers and chapter-wise question banks for Computer (BCT), Civil (BCE), and Electronics (BEX) engineering programs.",
  path: "/ioe",
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
    a: "Yes. All IOE past question papers on this portal are completely free. You can view them using the built-in PDF viewer or download them directly to your device.",
  },
  {
    q: "Which engineering programs are covered?",
    a: "We cover BCT (Computer Engineering), BCE (Civil Engineering), BEX (Electronics & Communication), and several other IOE programs including Electrical, Mechanical, Automobile, Geomatics, Industrial, Architecture, Agriculture, and Aerospace.",
  },
  {
    q: "How are the question papers organized?",
    a: "Papers are organized by program → semester → subject. You can also use the search bar to find any subject directly, or browse the complete A–Z archive.",
  },
  {
    q: "Does this site have chapter-wise question banks?",
    a: "Yes. For many subjects, the portal provides a chapter-wise question bank that analyzes past exam papers and shows how frequently specific topics appear across years.",
  },
  {
    q: "How recent are the papers available?",
    a: "We host papers from multiple exam years. Each subject page shows the available years (e.g. 2019, 2021, 2022, 2023) so you can quickly identify the most recent papers.",
  },
  {
    q: "What is IOE, TU?",
    a: "IOE stands for Institute of Engineering under Tribhuvan University (TU), Nepal. It conducts BE (Bachelor of Engineering) programs across multiple disciplines. IOE semester exams are held twice a year.",
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
    { label: "Engineering Programs", value: programs.length, icon: GraduationCap, colorClass: "bg-blue-600 dark:bg-blue-500" },
    { label: "Curated Subjects", value: subjects.length, icon: BookOpen, colorClass: "bg-emerald-600 dark:bg-emerald-500" },
    { label: "Past Exam Papers", value: total, icon: FileText, colorClass: "bg-violet-600 dark:bg-violet-500" },
    { label: "Semester Tracks", value: programs.reduce((n, p) => n + Object.keys(p.semesters).length, 0), icon: Layers, colorClass: "bg-amber-500 dark:bg-amber-500" },
  ];

  const items = programs.map((p) => ({
    name: p.fullName,
    path: `/ioe/${p.slug}`,
  }));

  const features = [
    { icon: FileText, label: "Official IOE exam papers" },
    { icon: Download, label: "Free PDF download" },
    { icon: BookOpen, label: "Chapter-wise question bank" },
    { icon: Sparkles, label: "Exam frequency analysis" },
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
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        {/* Subtle background texture */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #64748b 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        {/* Accent glow top-right */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-400/10 blur-3xl dark:bg-blue-500/10"
        />

        <div className="relative px-6 py-12 text-center sm:px-12 sm:py-16 lg:py-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1 text-xs font-semibold text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/60 dark:text-blue-300">
            <Sparkles className="h-3.5 w-3.5" />
            Tribhuvan University · Institute of Engineering
          </div>

          {/* H1 */}
          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
            IOE Past Question Papers
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-[15px]">
            Official semester exam papers with built-in PDF viewer, direct downloads, and
            chapter-wise question banks — analysed by exam-repetition frequency.
          </p>

          {/* Feature pills */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {features.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-600 dark:border-gray-700 dark:bg-gray-800 dark:text-slate-300"
              >
                <Icon className="h-3 w-3 shrink-0 text-blue-500" />
                {label}
              </span>
            ))}
          </div>

          {/* Search */}
          <div className="mx-auto mt-8 max-w-2xl">
            <HeroSearch subjects={searchItems} />
          </div>

          {/* Stats */}
          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200/80 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:shadow-sm dark:border-gray-800/80 dark:bg-gray-950/60"
                >
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${s.colorClass} shadow-sm`}>
                    <Icon className="h-4 w-4 text-white" />
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

      {/* ── Program Catalog ── */}
      <section className="space-y-5" aria-labelledby="programs-heading">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2
              id="programs-heading"
              className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl"
            >
              Browse by Engineering Program
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Select your department to view subjects grouped by semester (1–8).
            </p>
          </div>
          <Link
            href="/ioe/all"
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
          >
            All {subjects.length} Subjects Archive <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {programs.map((program) => {
            const semesterCount = Object.keys(program.semesters).length;
            const totalSubjectsInProgram = Object.values(program.semesters).flat().length;
            const cfg = PROGRAM_CONFIG[program.code] ?? PROGRAM_CONFIG.BCT;
            const ProgramIcon = cfg.icon;

            return (
              <Link
                key={program.code}
                href={`/ioe/${program.slug}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-blue-300/80 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-500/40 dark:hover:shadow-blue-950/20"
              >
                {/* Top row: badge + semesters chip */}
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono text-xs font-bold ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                      <ProgramIcon className="h-3.5 w-3.5" />
                      {program.code}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-gray-800 dark:text-slate-400">
                      {semesterCount} Sems
                    </span>
                  </div>

                  <h3 className="mt-4 text-[15px] font-bold leading-snug text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                    {program.name}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    {program.description}
                  </p>
                </div>

                {/* Bottom row */}
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-gray-800/80">
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    {totalSubjectsInProgram} subjects
                  </span>
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold transition-transform group-hover:translate-x-1 ${cfg.accentColor}`}>
                    View Semesters <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            );
          })}

          {/* Other Programs card */}
          <Link
            href="/ioe/other-programs"
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-amber-200/80 bg-amber-50/40 p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-amber-300 hover:shadow-md dark:border-amber-900/40 dark:bg-amber-950/10 dark:hover:border-amber-500/50"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-100/80 px-2.5 py-1 font-mono text-xs font-bold text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/60 dark:text-amber-300">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                  OTHER
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100/80 px-2 py-0.5 text-[10px] font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  9 Disciplines
                </span>
              </div>

              <h3 className="mt-4 text-[15px] font-bold leading-snug text-slate-900 transition-colors group-hover:text-amber-600 dark:text-white dark:group-hover:text-amber-400">
                Other Engineering Programs
              </h3>
              <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                Electrical, Mechanical, Automobile, Geomatics, Industrial, Architecture,
                Agriculture &amp; Aerospace question papers.
              </p>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-amber-100/80 pt-3 dark:border-gray-800/80">
              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                PDF Viewers &amp; Downloads
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 transition-transform group-hover:translate-x-1 dark:text-amber-400">
                View Archive <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* ── Why Use This Portal ── */}
      <section className="rounded-3xl border border-slate-200 bg-white px-6 py-10 shadow-xs dark:border-gray-800 dark:bg-gray-900 sm:px-10" aria-labelledby="why-heading">
        <h2 id="why-heading" className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
          Why Use IOE Papers?
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
          Everything an IOE engineering student needs for semester exam preparation, in one
          place.
        </p>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: FileText,
              title: "Official Past Papers",
              desc: "Authentic IOE semester exam papers — not notes or summaries. Access the real questions your examiners set.",
              color: "text-blue-600 dark:text-blue-400",
              bg: "bg-blue-50 dark:bg-blue-950/40",
            },
            {
              icon: Download,
              title: "Free PDF Downloads",
              desc: "Every paper is available as a PDF. Download for offline study or print for your revision sessions — always free.",
              color: "text-emerald-600 dark:text-emerald-400",
              bg: "bg-emerald-50 dark:bg-emerald-950/40",
            },
            {
              icon: BookOpen,
              title: "Chapter-wise Question Bank",
              desc: "Questions grouped by chapter so you can focus on the topics most likely to appear in your upcoming exam.",
              color: "text-violet-600 dark:text-violet-400",
              bg: "bg-violet-50 dark:bg-violet-950/40",
            },
            {
              icon: Sparkles,
              title: "Exam Frequency Analysis",
              desc: "See which questions repeat across years, helping you prioritize high-yield topics for your study sessions.",
              color: "text-amber-600 dark:text-amber-400",
              bg: "bg-amber-50 dark:bg-amber-950/40",
            },
            {
              icon: Layers,
              title: "All 8 Semesters Covered",
              desc: "From Semester 1 basics to Semester 8 advanced topics — complete curriculum coverage for every year of your BE.",
              color: "text-rose-600 dark:text-rose-400",
              bg: "bg-rose-50 dark:bg-rose-950/40",
            },
            {
              icon: GraduationCap,
              title: "Multiple Programs",
              desc: "BCT, BCE, BEX, BEI, and more. Whether you're in Computer, Civil, or Electronics — we've got your papers.",
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

      {/* ── How It Works ── */}
      <section className="space-y-5" aria-labelledby="how-heading">
        <div>
          <h2 id="how-heading" className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
            How to Find Your Papers
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Three quick ways to reach your IOE past question papers.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              step: "01",
              title: "Search by Subject",
              desc: "Type any subject name in the search bar above. Results appear instantly — click to go to the subject page.",
              action: { label: "Use Search ↑", href: "#" },
            },
            {
              step: "02",
              title: "Browse by Program",
              desc: "Select your engineering program (BCT / BCE / BEX), then pick a semester to see all subjects and papers.",
              action: { label: "Browse Programs", href: "/ioe#programs-heading" },
            },
            {
              step: "03",
              title: "A–Z Archive",
              desc: "Use the complete alphabetical archive for quick access to any subject with live filter and letter jump.",
              action: { label: "Open Archive", href: "/ioe/all" },
            },
          ].map(({ step, title, desc, action }) => (
            <div
              key={step}
              className="relative flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-gray-800/80 dark:bg-gray-900"
            >
              <span className="font-mono text-3xl font-extrabold text-slate-100 dark:text-gray-800">
                {step}
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{desc}</p>
              </div>
              <Link
                href={action.href}
                className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
              >
                {action.label} <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── Archive Callout ── */}
      <section className="flex flex-col gap-4 rounded-3xl border border-blue-200/60 bg-blue-50/60 p-6 shadow-xs dark:border-blue-900/40 dark:bg-blue-950/20 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            <BookOpen className="h-3 w-3" />
            Complete Index
          </div>
          <h3 className="mt-2 text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
            Looking for a specific subject or elective?
          </h3>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
            Browse the complete alphabetical index of all {subjects.length} IOE subjects with
            real-time live filtering.
          </p>
        </div>
        <Link
          href="/ioe/all"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm shadow-blue-500/20 transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          <BookOpen className="h-4 w-4" />
          Open Subjects Archive
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
            Common questions about IOE past question papers.
          </p>
        </div>

        <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white shadow-xs dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900">
          {FAQ_ITEMS.map(({ q, a }, i) => (
            <details key={i} className="group px-6 py-4">
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
          { icon: CheckCircle2, text: "100% free — no registration required", color: "text-emerald-600 dark:text-emerald-400" },
          { icon: CheckCircle2, text: "Official IOE / TU exam papers only", color: "text-blue-600 dark:text-blue-400" },
          { icon: CheckCircle2, text: "Built for engineering exam preparation", color: "text-violet-600 dark:text-violet-400" },
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
