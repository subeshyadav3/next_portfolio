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
  IoeAssessmentScheme,
  IoeProgramsFile,
  IoeQuestion,
  IoeSubjectQuestions,
  IoeSyllabus,
} from "./types";

const catalog = catalogJson as IoeCatalog;
const programsFile = programsJson as IoeProgramsFile;
const syllabusMap = syllabusJson as unknown as Record<string, IoeSyllabus>;

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

function drivePreviewUrl(id?: string): string {
  return id ? `https://drive.google.com/file/d/${id}/preview` : "";
}

function driveViewUrl(id?: string): string {
  return id ? `https://drive.google.com/file/d/${id}/view` : "";
}

function driveDownloadUrl(id?: string): string {
  return id ? `https://drive.google.com/uc?export=download&id=${id}` : "";
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
    archiveSourceUrl: catalog.source,
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
    const matchedIds = new Set(matched.map((m) => m.id));
    const crossProgramPapers = allPapers
      .filter((p) => !matchedIds.has(p.id))
      .map((p) => ({ ...p, isCrossSemester: true }));
    return [...matched, ...crossProgramPapers];
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

export const QUESTION_SLUG_MAP: Record<string, string> = {
  "c-programming": "computer-programming",
  "data-structures-and-algorithms": "data-structure-and-algorithm",
  "data-structure-and-algorithum": "data-structure-and-algorithm",
  "database-management-systems": "database-management-system",
  "operating-systems": "operating-system",
  "microprocessor": "microprocessors",
  "microprocessors-and-microcontrollers": "microprocessors",
  "computer-network": "computer-networks",
  "computer-organization-architecture": "computer-organization-and-architecture",
  "computer-graphics": "computer-graphics-and-visualization",
  "digital-logic-bei": "digital-logic",
  "digital-signal-analysis-and-processing": "digital-signal-processing",
  "digital-signal-processing-and-application": "digital-signal-processing",
  "energy-environment-and-society": "energy-environment-and-social-engineering",
  "technology-environment-and-society": "energy-environment-and-social-engineering",
  "electronic-devices-and-circuits": "electronic-device-and-circuits",
  "basic-electrical-engineering": "fundamental-of-electrical-and-electronics-engineering",
  "basic-electrical-and-electronics-engineering": "fundamental-of-electrical-and-electronics-engineering",
  "propogation-and-antennna": "propagation-and-antenna",
  "propogation-and-antenna": "propagation-and-antenna",
  "telecommunication": "telecommunication-and-computer-networks",
  "applied-mechanics": "engineering-mechanics",
  "civil-engineering-material": "civil-engineering-materials",
  "engineering-geology": "engineering-geology-i",
  "strength-of-material": "strength-of-materials",
  "stregth-of-materials": "strength-of-materials",
  "surveying-i": "engineering-survey-i",
  "surveying-ii": "engineering-survey-ii",
  "theory-of-structure-i": "theory-of-structures-i",
  "theory-of-structure-ii": "theory-of-structures-ii",
  "design-of-steel-and-timber-structure": "design-of-steel-structures",
  "transportation-engineering": "transportation-engineering-ii",
  "professional-and-social-engineering": "energy-environment-and-social-engineering",
  "hydropower": "hydropower-engineering",
  "project-and-construction-engineering": "construction-management",
};

type RawQuestionInput = Partial<IoeQuestion> & Record<string, unknown>;

interface RawSubjectQuestionsInput {
  subject?: string;
  chapters?: string[];
  questions: RawQuestionInput[];
  [key: string]: unknown;
}

function normalizeQuestionKey(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^\w$]/g, "")
    .trim();
}

function normalizeQuestionsData(raw: RawSubjectQuestionsInput | null | undefined): IoeSubjectQuestions | null {
  if (!raw || !Array.isArray(raw.questions)) return null;
  const chSet = new Set<string>();
  const mergedMap = new Map<string, IoeQuestion & { _yearSet: Set<string> }>();

  const upsertQuestion = (q: RawQuestionInput, sessionHint?: string) => {
    const text = ((q.text as string) || (q.question as string) || "").trim();
    if (!text) return;
    const key = normalizeQuestionKey(text);
    if (!key) return;

    const rawYears = (q.years || q.examSessions || (q.year ? [q.year] : [])) as string[];
    const chapter = ((q.chapter as string) || "General").trim() || "General";
    chSet.add(chapter);

    const existing = mergedMap.get(key);
    if (existing) {
      for (const yr of rawYears) {
        if (yr?.trim()) existing._yearSet.add(yr.trim());
      }
      if (sessionHint?.trim()) existing._yearSet.add(sessionHint.trim());
      if ((!existing.chapter || existing.chapter === "General") && chapter !== "General") {
        existing.chapter = chapter;
      }
      if (!existing.marks && q.marks !== undefined) {
        existing.marks = String(q.marks);
      }
      if (q.isDiagram && !existing.isDiagram) {
        existing.isDiagram = true;
      }
      const freqCandidate = typeof q.frequency === "number" ? q.frequency : 0;
      existing.frequency = Math.max(existing.frequency ?? 1, freqCandidate, existing._yearSet.size, 1);
      return;
    }

    const yearSet = new Set<string>();
    for (const yr of rawYears) {
      if (yr?.trim()) yearSet.add(yr.trim());
    }
    if (sessionHint?.trim()) yearSet.add(sessionHint.trim());
    const freq = Math.max(
      typeof q.frequency === "number" ? q.frequency : 0,
      yearSet.size,
      1
    );

    mergedMap.set(key, {
      ...q,
      text,
      question: text,
      years: [],
      examSessions: [],
      frequency: freq,
      chapter,
      marks: q.marks !== undefined ? String(q.marks) : undefined,
      _yearSet: yearSet,
    });
  };

  for (const q of raw.questions) {
    upsertQuestion(q);
  }

  const yearWisePapers = Array.isArray(raw.yearWisePapers)
    ? (raw.yearWisePapers as Array<Record<string, unknown>>).map((paper) => {
        const session = ((paper.session as string) || "").trim();
        const pQuestions = Array.isArray(paper.questions)
          ? (paper.questions as RawQuestionInput[]).map((q) => {
              upsertQuestion(q, session);
              const text = (q.text as string) || (q.question as string) || "";
              const chapter = (q.chapter as string) || "General";
              chSet.add(chapter);
              return {
                ...q,
                text,
                question: text,
                chapter,
                marks: q.marks !== undefined ? String(q.marks) : undefined,
              };
            })
          : [];
        return {
          session,
          year: paper.year as string | undefined,
          month: paper.month as string | undefined,
          examType: paper.examType as "Regular" | "Back" | "Special" | undefined,
          totalMarks: typeof paper.totalMarks === "number" ? paper.totalMarks : undefined,
          questions: pQuestions,
        };
      })
    : undefined;

  const questions: IoeQuestion[] = Array.from(mergedMap.values())
    .map(({ _yearSet, ...rest }) => {
      const years = Array.from(_yearSet);
      return {
        ...rest,
        years,
        examSessions: years,
        frequency: Math.max(rest.frequency ?? 1, years.length, 1),
      };
    })
    .sort((a, b) => (b.frequency ?? 1) - (a.frequency ?? 1));

  const baseChapters =
    raw.chapters && raw.chapters.length > 0 ? raw.chapters : [];
  const chapters = [
    ...baseChapters,
    ...Array.from(chSet).filter((c) => !baseChapters.includes(c)),
  ];

  return {
    ...raw,
    subject: raw.subject ?? "",
    chapters,
    questions,
    yearWisePapers,
  };
}

export async function getSubjectQuestions(subjectSlug: string): Promise<IoeSubjectQuestions | null> {
  if (!subjectSlug) return null;
  const target = QUESTION_SLUG_MAP[subjectSlug] || subjectSlug;
  try {
    const mod = await import(`@/data/ioe/questions/${target}.json`);
    return normalizeQuestionsData(mod.default ?? mod);
  } catch {
    if (target !== subjectSlug) {
      try {
        const fallbackMod = await import(`@/data/ioe/questions/${subjectSlug}.json`);
        return normalizeQuestionsData(fallbackMod.default ?? fallbackMod);
      } catch {
        return null;
      }
    }
    return null;
  }
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

function syllabusText(syllabus: IoeSyllabus): string {
  return (syllabus.units ?? [])
    .flatMap((unit) => [unit.title, ...(unit.topics ?? []).map((topic) => topic.title)])
    .join(" ");
}

export function getAssessmentScheme(subjectName: string): IoeAssessmentScheme {
  const syllabus = getSyllabusForSubject(subjectName);
  const text = syllabus ? syllabusText(syllabus) : "";
  const explicit = text.match(/(?:theory|written|external)[^\d]{0,80}(\d{2})\s*marks[^\d]{0,80}(?:internal|assessment)[^\d]{0,80}(\d{2})\s*marks/i);

  if (explicit) {
    const theory = Number(explicit[1]);
    const internal = Number(explicit[2]);
    return {
      theory,
      internal,
      passTheory: Math.round(theory * 0.4),
      passInternal: Math.round(internal * 0.4),
      source: "syllabus",
    };
  }

  return {
    theory: 60,
    internal: 40,
    passTheory: 24,
    passInternal: 16,
    source: "general",
  };
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
