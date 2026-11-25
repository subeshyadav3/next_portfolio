import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/site-config";
import { IOE_ENABLED } from "@/lib/ioe/config";
import { ChevronRight, BookOpen, ShieldCheck, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "About the IOE Papers Archive",
  description:
    "How the independent IOE Papers study archive catalogs TU engineering past question papers, chapter-wise PYQs, and curriculum syllabi.",
  alternates: { canonical: `${SITE_URL}/ioe/about` },
};

export default function IoeAboutPage() {
  if (!IOE_ENABLED) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <nav className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
        <Link href="/ioe" className="transition-colors hover:text-blue-600 dark:hover:text-blue-400">
          IOE
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        <span className="font-semibold text-slate-900 dark:text-white">About</span>
      </nav>

      <header className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-gray-800/90 dark:bg-gray-900 sm:p-8">
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1 font-mono text-xs font-bold text-white dark:bg-blue-500">
          <BookOpen className="h-3.5 w-3.5" />
          About This Archive
        </span>
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Built for IOE Semester Exam Prep
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
          {SITE_NAME} maintains this independent study archive to bring Tribhuvan University (IOE)
          past question papers, chapter-wise repeated PYQs, and curriculum syllabi together in one
          searchable interface.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-gray-800/90 dark:bg-gray-900 sm:p-6">
          <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
            <BookOpen className="h-4 w-4 text-blue-500" />
            How Content Is Organized
          </h2>
          <p className="mt-2.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300 sm:text-sm">
            Every subject combines available past exam PDFs with extracted chapter-wise and
            year-wise questions, sorted by repeat frequency alongside official unit breakdowns.
          </p>
          <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            Verify current exam schedules, syllabus updates, and official notices directly with IOE
            or Tribhuvan University before sitting an exam.
          </p>
        </section>

        <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-gray-800/90 dark:bg-gray-900 sm:p-6">
          <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            Corrections &amp; Removals
          </h2>
          <p className="mt-2.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300 sm:text-sm">
            If a question paper is mislabeled, broken, or should be removed, contact us with the
            subject name, filename, and page URL so we can update or remove the record promptly.
          </p>
          <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold">
            <Link
              href="/blog/contact"
              className="inline-flex items-center gap-1 text-blue-600 hover:underline dark:text-blue-400"
            >
              <Mail className="h-3.5 w-3.5" />
              Contact Page
            </Link>
            <Link
              href="/blog/disclaimer"
              className="text-slate-600 hover:text-blue-600 hover:underline dark:text-slate-400"
            >
              Full Disclaimer
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
