/**
 * IOE data loaders — read only the checked-in catalog/program JSON files.
 * No database and no blog dependencies.
 */

import catalogJson from "@/data/ioe/catalog.json";
import programsJson from "@/data/ioe/programs.json";
import syllabusJson from "@/data/ioe/syllabus.json";
import type {
  IoeCatalog,
  IoeCatalogSubject,
  IoePaper,
  IoePaperFile,
  IoeProgram,
  IoeProgramsFile,
  IoeSubjectQuestions,
  IoeSyllabus,
} from "./types";

const catalog = catalogJson as IoeCatalog;
const programsFile = programsJson as IoeProgramsFile;
const syllabusMap = syllabusJson as Record<string, IoeSyllabus>;

/** Normalize a subject name for matching: lowercase, '&' -> 'and', strip extra symbols. */
export function normalizeSubjectName(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Normalized key stripping common grammatical / numbering variants for robust cross-mapping. */
export function normalizeSubjectKey(name: string): string {
  return normalizeSubjectName(name)
    .replace(/\bmaterials\b/g, "material")
    .replace(/\bnetworks\b/g, "network")
    .replace(/\bsystems\b/g, "system")
    .replace(/\bmicroprocessors\b/g, "microprocessor")
    .replace(/\bengineering drawing i\b/g, "engineering drawing")
    .replace(/\bapplied mechanics\b/g, "applied mechanics");
}

export function getCatalogs(): IoeCatalogSubject[] {
  return catalog.subjects;
}

export function isSubjectPublic(_subjectName: string): boolean {
  return true;
}

export function getPublicCatalogs(): IoeCatalogSubject[] {
  return catalog.subjects;
}

export function findCatalogSubject(title: string): IoeCatalogSubject | undefined {
  if (!title) return undefined;
  const targetSlug = getSubjectSlugFromName(title);
  const exact = catalog.subjects.find((s) => getSubjectSlugFromName(s.name) === targetSlug);
  if (exact) return exact;

  const want = normalizeSubjectName(title);
  const normMatch = catalog.subjects.find((s) => normalizeSubjectName(s.name) === want);
  if (normMatch) return normMatch;

  const wantKey = normalizeSubjectKey(title);
  return catalog.subjects.find((s) => normalizeSubjectKey(s.name) === wantKey);
}

export function getAllPrograms(): IoeProgram[] {
  return programsFile.programs;
}

export function getProgram(code: string): IoeProgram | undefined {
  const query = code.toLowerCase();
  return programsFile.programs.find(
    (p) => p.code.toLowerCase() === query || p.slug.toLowerCase() === query
  );
}

export function getSemesterSubjects(program: IoeProgram, semester: string) {
  return program.semesters[semester] ?? [];
}

export function subjectHasPapers(catalogSubject: IoeCatalogSubject | undefined): boolean {
  return !!catalogSubject && catalogSubject.papers.length > 0;
}

function drivePreviewUrl(id: string): string {
  return `https://drive.google.com/file/d/${id}/preview`;
}

function driveDownloadUrl(id: string): string {
  return `https://drive.google.com/uc?export=download&id=${id}`;
}

function driveViewUrl(id: string): string {
  return `https://drive.google.com/file/d/${id}/preview`;
}

export function toPaper(
  subject: string,
  file: IoePaperFile
): IoePaper {
  return {
    id: file.id,
    file: file.file,
    sem: file.sem,
    subject,
    previewUrl: drivePreviewUrl(file.id),
    downloadUrl: driveDownloadUrl(file.id),
    driveViewUrl: driveViewUrl(file.id),
  };
}

export function getPapersForSubject(catalogSubject: IoeCatalogSubject, semester?: string): IoePaper[] {
  const allPapers = catalogSubject.papers.map((p) => toPaper(catalogSubject.name, p));
  if (!semester) return allPapers;

  const target = semester.toLowerCase().replace(/[^0-9]/g, "");
  if (!target) return allPapers;

  const matched = allPapers.filter((p) => {
    const semLower = p.sem.toLowerCase();
    return (
      semLower.includes(`${target}th`) ||
      semLower.includes(`${target}st`) ||
      semLower.includes(`${target}nd`) ||
      semLower.includes(`${target}rd`)
    );
  });

  if (matched.length > 0) {
    return matched;
  }

  // Cross-semester paper fallback (e.g. 5th-sem paper used for 6th-sem shared syllabus)
  return allPapers.map((p) => ({
    ...p,
    isCrossSemester: true,
  }));
}

export function getPaperById(id: string): IoePaper | null {
  for (const subject of catalog.subjects) {
    for (const file of subject.papers) {
      if (file.id === id) return toPaper(subject.name, file);
    }
  }
  return null;
}

export function slugifySubject(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getSubjectSlugFromName(name: string): string {
  return slugifySubject(name);
}

export function countPapers(): number {
  return catalog.subjects.reduce((n, s) => n + s.papers.length, 0);
}

export function listSubjectsWithPapers(): Array<{ name: string; papers: IoePaperFile[] }> {
  return catalog.subjects.filter((s) => s.papers.length > 0);
}

/** All subjects that exist in the catalog but aren't listed in any program curriculum. */
export function getUnmappedSubjects(): IoeCatalogSubject[] {
  const mapped = new Set<string>();
  for (const program of programsFile.programs) {
    for (const subjects of Object.values(program.semesters)) {
      for (const s of subjects) mapped.add(normalizeSubjectName(s.title));
    }
  }
  return catalog.subjects.filter((s) => !mapped.has(normalizeSubjectName(s.name)));
}

export async function getSubjectQuestions(_subjectSlug: string): Promise<IoeSubjectQuestions | null> {
  return null;
}

export function getSyllabusForSubject(subjectName: string): IoeSyllabus | null {
  if (!subjectName) return null;
  const direct = syllabusMap[subjectName];
  if (direct) return direct;

  const norm = normalizeSubjectName(subjectName);
  for (const [title, entry] of Object.entries(syllabusMap)) {
    if (normalizeSubjectName(title) === norm) return entry;
  }

  const normKey = normalizeSubjectKey(subjectName);
  for (const [title, entry] of Object.entries(syllabusMap)) {
    if (normalizeSubjectKey(title) === normKey) return entry;
  }

  return null;
}

export interface SubjectProgramInfo {
  code: string;
  slug: string;
  name: string;
  semester: string;
}

export function getSubjectPrograms(subjectName: string): SubjectProgramInfo[] {
  const normTarget = normalizeSubjectName(subjectName);
  const targetSlug = getSubjectSlugFromName(subjectName);
  const results: SubjectProgramInfo[] = [];
  const seen = new Set<string>();

  for (const program of programsFile.programs) {
    for (const [semester, rows] of Object.entries(program.semesters)) {
      for (const row of rows) {
        if (
          normalizeSubjectName(row.title) === normTarget ||
          getSubjectSlugFromName(row.title) === targetSlug
        ) {
          const key = `${program.code}-${semester}`;
          if (!seen.has(key)) {
            seen.add(key);
            results.push({
              code: program.code,
              slug: program.slug,
              name: program.name,
              semester,
            });
          }
        }
      }
    }
  }
  return results;
}

export function getSubjectPrimaryPath(subjectName: string): string {
  const progs = getSubjectPrograms(subjectName);
  if (progs.length > 0) {
    const first = progs[0];
    return `/ioe/${first.slug}/semester/${first.semester}/${getSubjectSlugFromName(subjectName)}`;
  }
  return `/ioe/subjects/${getSubjectSlugFromName(subjectName)}`;
}
