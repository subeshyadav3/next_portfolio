import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/site-config";
import { IOE_ENABLED } from "@/lib/ioe/config";

export const metadata: Metadata = {
  title: "About the IOE Papers Archive",
  description:
    "Learn how the independent IOE Papers archive catalogs publicly available engineering question papers and curriculum resources.",
  alternates: { canonical: `${SITE_URL}/ioe/about` },
};

export default function IoeAboutPage() {
  if (!IOE_ENABLED) notFound();

  return (
    <article className="mx-auto max-w-3xl space-y-8">
      <header className="space-y-3">
        <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">IOE Papers</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          About this archive
        </h1>
        <p className="text-base leading-7 text-slate-600 dark:text-slate-300">
          {SITE_NAME} maintains this independent reference archive to help engineering students
          find publicly available IOE question papers and curriculum information in one place.
        </p>
      </header>

      <section className="space-y-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">How documents are cataloged</h2>
        <p>
          Paper records are organized by program, semester, subject, and archive filename. The
          files are linked from publicly available sources and are not created or issued by this
          website.
        </p>
        <p>
          Curriculum links and topic lists are presented as study references. Students should
          verify current examination rules, syllabus revisions, and official notices with IOE or
          Tribhuvan University before relying on them for an examination.
        </p>
      </section>

      <section className="space-y-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Corrections and removal</h2>
        <p>
          If a document is incorrectly labeled, unavailable, or should be removed, use the
          contact details in the site disclaimer with the subject, filename, and relevant URL.
          Reports are reviewed before catalog records are changed.
        </p>
        <p>
          This archive is not affiliated with, endorsed by, or operated by IOE, TU, or any
          engineering campus. See the <Link className="font-semibold text-blue-600 hover:underline dark:text-blue-400" href="/blog/disclaimer">full disclaimer</Link> for details.
        </p>
      </section>
    </article>
  );
}
