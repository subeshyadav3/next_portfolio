import Link from "next/link";
import type { Metadata } from "next";
import { ThemeToggle } from "@/components/blog/ThemeToggle";
import { BookOpen, ArrowLeft, GraduationCap, Library, ChevronRight } from "lucide-react";
import { IoeNavMobile } from "@/components/ioe/IoeNavMobile";

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
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-lg transition-colors duration-200 dark:border-gray-800/80 dark:bg-gray-950/90 dark:shadow-gray-950/40">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          {/* Brand */}
          <Link href="/ioe" className="group flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 font-bold text-white shadow-md shadow-blue-500/25 transition-all group-hover:scale-105 group-hover:bg-blue-700 dark:bg-blue-500 dark:shadow-blue-500/20">
              <BookOpen className="h-4 w-4" />
            </div>
            <div className="flex flex-col leading-none">
              <div className="flex items-center gap-1.5">
                <span className="text-[15px] font-bold tracking-tight text-slate-900 dark:text-white">
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
            <Link
              href="/ioe/all"
              className="hidden items-center gap-1.5 rounded-lg px-3 py-1.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 sm:flex dark:text-slate-400 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              <Library className="h-3.5 w-3.5" />
              All Subjects
            </Link>
            <Link
              href="/ioe"
              className="hidden items-center gap-1.5 rounded-lg px-3 py-1.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 sm:flex dark:text-slate-400 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              <GraduationCap className="h-3.5 w-3.5" />
              Programs
            </Link>
            <div className="mx-1 hidden h-4 w-px bg-slate-200 sm:block dark:bg-gray-800" />
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
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        {children}
      </main>

      {/* ── Footer ── */}
      <footer className="mt-16 border-t border-slate-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        {/* Upper footer */}
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand column */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 dark:bg-blue-500">
                  <BookOpen className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="font-bold text-slate-900 dark:text-white">IOE Papers</span>
              </div>
              <p className="mt-3 max-w-xs text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                Independent educational portal offering free IOE (TU) past question papers,
                curriculum syllabus, and exam preparation guidelines for engineering students.
              </p>
              <p className="mt-3 text-[11px] leading-relaxed text-slate-400 dark:text-slate-500">
                Disclaimer: Not affiliated with, endorsed by, or operated by Tribhuvan University
                (TU) or Institute of Engineering (IOE). For academic study and reference only.
              </p>
            </div>

            {/* Programs */}
            <div>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Programs
              </h3>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                {[
                  { label: "BCT – Computer", href: "/ioe/bct" },
                  { label: "BCE – Civil", href: "/ioe/bce" },
                  { label: "BEX – Electronics", href: "/ioe/bex" },
                  { label: "Other Programs", href: "/ioe/other-programs" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="flex items-center gap-1 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      <ChevronRight className="h-3 w-3 shrink-0" />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Resources
              </h3>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                {[
                  { label: "All Subjects A–Z", href: "/ioe/all" },
                  { label: "IOE Home", href: "/ioe" },
                  { label: "Blog", href: "/blog" },
                  { label: "Portfolio", href: "/" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="flex items-center gap-1 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      <ChevronRight className="h-3 w-3 shrink-0" />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal & Trust */}
            <div>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Legal & Trust
              </h3>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                {[
                  { label: "About Us", href: "/blog/about" },
                  { label: "Contact Us", href: "/blog/contact" },
                  { label: "Privacy Policy", href: "/blog/privacy" },
                  { label: "Terms of Service", href: "/blog/terms" },
                  { label: "Disclaimer", href: "/blog/disclaimer" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="flex items-center gap-1 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      <ChevronRight className="h-3 w-3 shrink-0" />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-100 px-4 py-4 dark:border-gray-800/60">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 dark:text-slate-500">
            <span>© {new Date().getFullYear()} IOE Papers — Independent educational resource for engineering students.</span>
            <span>Built for engineering students preparing for semester exams</span>
          </div>
        </div>
      </footer>
    </div>
  );
}