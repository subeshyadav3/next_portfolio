import Link from "next/link";
import {
  countPapers,
  getAllPrograms,
  getCatalogs,
  getSubjectSlugFromName,
} from "@/lib/ioe/data";
import { IOE_DRIVE_SOURCE } from "@/lib/ioe/config";

/**
 * IOE management panel — shown on /admin/ioe and inside the
 * /admin/posts?area=ioe view. Read-only catalog management for now;
 * structured edits happen in data/ioe/*.json via the repo.
 */
export function IoeAdminPanel() {
  const programs = getAllPrograms();
  const subjects = getCatalogs();

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200">
        IOE is managed separately from the blog. The Blog <code>Post</code> table
        is untouched; papers live on Google Drive and only file IDs are stored
        here.
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Programs", value: programs.length },
          { label: "Subjects", value: subjects.length },
          { label: "Papers", value: countPapers() },
          { label: "Drive source", value: "Linked" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      <section>
        <h2 className="text-lg font-semibold">Programs &amp; curriculum</h2>
        <div className="mt-3 space-y-3">
          {programs.map((program) => (
            <div key={program.code} className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs text-blue-600 dark:text-blue-400">{program.code}</span>
                  <span className="ml-2 font-medium">{program.fullName}</span>
                </div>
                <Link
                  href={`/ioe/${program.slug}`}
                  className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                  target="_blank"
                >
                  View public page
                </Link>
              </div>
              <p className="mt-1 text-xs text-gray-400">
                {Object.keys(program.semesters).length} semesters ·{" "}
                {Object.values(program.semesters).reduce((n, s) => n + s.length, 0)} subjects
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Subjects with papers</h2>
        <div className="mt-3 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <Th>Subject</Th>
                <Th>Papers</Th>
                <Th>View</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-gray-950">
              {subjects.map((subject) => (
                <tr key={subject.name}>
                  <td className="px-4 py-2.5 text-sm">{subject.name}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-500 dark:text-gray-400">
                    {subject.papers.length}
                  </td>
                  <td className="px-4 py-2.5">
                    <Link
                      href={`/ioe/subjects/${getSubjectSlugFromName(subject.name)}`}
                      className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                      target="_blank"
                    >
                      Open
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 p-4 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
        <span className="font-medium text-gray-700 dark:text-gray-300">Source:</span>{" "}
        <a
          href={IOE_DRIVE_SOURCE}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          Google Drive folder
        </a>
      </section>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
      {children}
    </th>
  );
}