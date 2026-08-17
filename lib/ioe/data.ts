/**
 * IOE data loaders — read only the checked-in catalog/program JSON files.
 * No database and no blog dependencies.
 */

import catalogJson from "@/data/ioe/catalog.json";
import programsJson from "@/data/ioe/programs.json";
import syllabusJson from "@/data/ioe/syllabus.json";
import questionIndexJson from "@/data/ioe/question-index.json";
import type {
  IoeCatalog,
  IoeCatalogSubject,
  IoePaper,
  IoePaperFile,
  IoeProgram,
  IoeProgramsFile,
  IoeSubjectQuestions,
  IoeSyllabus,
  IoeQuestionIndexEntry,
} from "./types";

const catalog = catalogJson as IoeCatalog;
const programsFile = programsJson as IoeProgramsFile;
const syllabusMap = syllabusJson as Record<string, IoeSyllabus>;
const questionIndex = questionIndexJson as Record<string, IoeQuestionIndexEntry>;

/** Normalize a subject name for matching: lowercase, '&' -> 'and', strip extra symbols. */
export function normalizeSubjectName(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getCatalogs(): IoeCatalogSubject[] {
  return catalog.subjects;
}

export function isSubjectPublic(subjectName: string): boolean {
  return questionIndex[getSubjectSlugFromName(subjectName)]?.public === true;
}

export function getPublicCatalogs(): IoeCatalogSubject[] {
  return catalog.subjects.filter((subject) => isSubjectPublic(subject.name));
}

export function findCatalogSubject(title: string): IoeCatalogSubject | undefined {
  const targetSlug = getSubjectSlugFromName(title);
  const exact = catalog.subjects.find((s) => getSubjectSlugFromName(s.name) === targetSlug);
  if (exact) return exact;

  const want = normalizeSubjectName(title);
  return catalog.subjects.find((s) => normalizeSubjectName(s.name) === want);
}

export function getAllPrograms(): IoeProgram[] {
  return programsFile.programs;
}

export function getProgram(code: string): IoeProgram | undefined {
  return programsFile.programs.find((p) => p.code.toLowerCase() === code.toLowerCase());
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
  return `https://drive.google.com/file/d/${id}/view`;
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

export function getPapersForSubject(catalogSubject: IoeCatalogSubject): IoePaper[] {
  return catalogSubject.papers.map((p) => toPaper(catalogSubject.name, p));
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

export async function getSubjectQuestions(subjectSlug: string): Promise<IoeSubjectQuestions | null> {
  try {
    const mod = (await import(`@/data/ioe/questions/${subjectSlug}.json`)) as {
      default: IoeSubjectQuestions;
    };
    return mod.default;
  } catch {
    return null;
  }
}

export function getSyllabusForSubject(subjectName: string): IoeSyllabus | null {
  const direct = syllabusMap[subjectName];
  if (direct) return direct;
  const norm = normalizeSubjectName(subjectName);
  for (const [title, entry] of Object.entries(syllabusMap)) {
    if (normalizeSubjectName(title) === norm) return entry;
  }
  return null;
}
