import Link from "next/link";
import type { Metadata } from "next";
import { ThemeToggle } from "@/components/blog/ThemeToggle";
import { BookOpen, ArrowLeft, ChevronRight } from "lucide-react";
import { IoeNavMobile } from "@/components/ioe/IoeNavMobile";
import { IoeNavLinks } from "@/components/ioe/IoeNavLinks";

export const dynamic = "force-static";
export const revalidate = false;

export const metadata: Metadata = {
  title: {
    template: "%s",
    default: "IOE Engineering Past Question Papers & Syllabus Archive | TU Nepal",
  },
};

/**
 * Route group layout for /ioe. Independent of the Blog layout.
 * The portfolio-root layout (app/layout.tsx) still applies globally.
 */
export default function IoeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="ioe-section min-h-screen bg-slate-50 text-slate-900 antialiased transition-colors duration-200 dark:bg-[#090d16] dark:text-slate-100">
      {/* ── Sticky Header ── */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-xs backdrop-blur-lg transition-colors duration-200 dark:border-gray-800/80 dark:bg-gray-950/95 dark:shadow-gray-950/40">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-2.5 sm:gap-3 sm:px-6">
          {/* Brand */}
          <Link href="/ioe" className="group flex shrink-0 items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 font-bold text-white shadow-sm shadow-blue-500/25 transition-all group-hover:scale-105 group-hover:bg-blue-700 dark:bg-blue-500 dark:shadow-blue-500/20">
              <BookOpen className="h-4 w-4" />
            </div>
            <div className="flex flex-col leading-none">
              <div className="flex items-center gap-1.5">
                <span className="text-[15px] font-extrabold tracking-tight text-slate-900 dark:text-white">
                  IOE Papers
                </span>
                <span className="rounded-md bg-blue-600 px-1.5 py-0.5 text-[10px] font-bold text-white dark:bg-blue-500">
                  TU
                </span>
              </div>
              <span className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                PYQs &amp; Syllabus Archive
              </span>
            </div>
          </Link>

          {/* Nav */}
          <nav className="flex items-center gap-1.5 text-sm font-medium sm:gap-2">
            <IoeNavLinks />
            <div className="mx-1 hidden h-4 w-px bg-slate-200 md:block dark:bg-gray-800" />
            <ThemeToggle />
            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 dark:border-gray-700 dark:bg-gray-900 dark:text-slate-300 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Portfolio</span>
            </Link>
            <IoeNavMobile />
          </nav>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="mx-auto max-w-6xl px-3.5 py-5 sm:px-6 sm:py-10">
        {children}
      </main>

      {/* ── Footer ── */}
      <footer className="mt-12 border-t border-slate-200/90 bg-white dark:border-gray-800/90 dark:bg-gray-950 sm:mt-16">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-12">
            {/* Brand column */}
            <div className="space-y-3 lg:col-span-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 shadow-xs dark:bg-blue-500">
                  <BookOpen className="h-4 w-4 text-white" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
                    IOE Papers
                  </span>
                  <span className="rounded bg-blue-50 px-1.5 py-0.5 font-mono text-[10px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    TU Study Hub
                  </span>
                </div>
              </div>
              <p className="max-w-sm text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                Organized collection of IOE past exam papers, chapter-sorted repeated questions,
                year-wise question banks, and official TU engineering syllabi—built to help students
                prepare faster without digging through broken Drive links.
              </p>
              <p className="max-w-sm rounded-xl border border-slate-200/80 bg-slate-50 px-3 py-2 text-[11px] leading-relaxed text-slate-500 dark:border-gray-800 dark:bg-gray-900/60 dark:text-slate-400">
                Independent academic resource. Not affiliated with or endorsed by Tribhuvan
                University (TU) or the Institute of Engineering (IOE).
              </p>
            </div>

            {/* Links grid */}
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:col-span-7">
              {/* Programs */}
              <div>
                <h3 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Programs
                </h3>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  {[
                    { label: "BCT – Computer", href: "/ioe/bct" },
                    { label: "BCE – Civil", href: "/ioe/bce" },
                    { label: "BEX – Electronics", href: "/ioe/bex" },
                    { label: "Other 9 Faculties", href: "/ioe/other-programs" },
                  ].map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="inline-flex items-center gap-1 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        <ChevronRight className="h-3 w-3 shrink-0 text-slate-400" />
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Study Hubs */}
              <div>
                <h3 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Archive
                </h3>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  {[
                    { label: "IOE Overview", href: "/ioe" },
                    { label: "All Subjects A–Z", href: "/ioe/all" },
                    { label: "About this Archive", href: "/ioe/about" },
                    { label: "Developer Blog", href: "/blog" },
                    { label: "Main Portfolio", href: "/" },
                  ].map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="inline-flex items-center gap-1 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        <ChevronRight className="h-3 w-3 shrink-0 text-slate-400" />
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal & Contact */}
              <div className="col-span-2 sm:col-span-1">
                <h3 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Info &amp; Legal
                </h3>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-slate-600 dark:text-slate-400 sm:grid-cols-1">
                  {[
                    { label: "About Us", href: "/blog/about" },
                    { label: "Contact", href: "/blog/contact" },
                    { label: "Privacy Policy", href: "/blog/privacy" },
                    { label: "Terms of Service", href: "/blog/terms" },
                    { label: "Disclaimer", href: "/blog/disclaimer" },
                  ].map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="inline-flex items-center gap-1 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        <ChevronRight className="h-3 w-3 shrink-0 text-slate-400" />
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-4 dark:border-gray-800/70 dark:bg-gray-900/40">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 text-center text-[11px] text-slate-500 dark:text-slate-400 sm:flex-row sm:text-left">
            <span>© {new Date().getFullYear()} IOE Papers · Independent TU Engineering Study Archive</span>
            <span>Built for quick semester revision &amp; PYQ practice</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
