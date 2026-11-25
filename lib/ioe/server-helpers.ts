import fs from "fs";
import path from "path";
import {
  QUESTION_SLUG_MAP,
  findCatalogSubject,
  getCatalogs,
  getSubjectSlugFromName,
} from "./data";

let cachedQuestionSlugs: Set<string> | null = null;

/**
 * Server-only helper returning the set of available question-bank JSON slugs.
 */
export function getAvailableQuestionSlugs(): Set<string> {
  if (cachedQuestionSlugs) return cachedQuestionSlugs;
  const dir = path.join(process.cwd(), "data/ioe/questions");
  try {
    const files = fs.readdirSync(dir);
    cachedQuestionSlugs = new Set(
      files.filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, ""))
    );
  } catch {
    cachedQuestionSlugs = new Set();
  }
  return cachedQuestionSlugs;
}

/**
 * Checks whether a subject has an interactive chapter-wise/year-wise PYQ question bank.
 */
export function hasQuestionBankForSubject(subjectName: string): boolean {
  if (!subjectName) return false;
  const slugs = getAvailableQuestionSlugs();
  const slug = getSubjectSlugFromName(subjectName);
  const mapped = QUESTION_SLUG_MAP[slug] || slug;
  return slugs.has(mapped) || slugs.has(slug);
}

/**
 * Returns the number of catalog subjects that have interactive PYQ question banks.
 */
export function countSubjectsWithQuestionBank(): number {
  return getCatalogs().filter((s) => hasQuestionBankForSubject(s.name) && findCatalogSubject(s.name)).length;
}
