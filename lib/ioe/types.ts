/**
 * IOE catalog + program/curriculum types.
 *
 * The catalog stores Google Drive file IDs only — never PDF bytes. The
 * existing Blog/Post model is untouched by this module.
 */

export interface IoePaperFile {
  id: string;
  file: string;
  sem: string;
}

export interface IoeCatalogSubject {
  name: string;
  papers: IoePaperFile[];
}

export interface IoeCatalog {
  source: string;
  subjects: IoeCatalogSubject[];
}

export interface IoeCurriculumSubject {
  code: string;
  title: string;
}

export interface IoeProgram {
  code: string;
  name: string;
  slug: string;
  fullName: string;
  description: string;
  semesters: Record<string, IoeCurriculumSubject[]>;
}

export interface IoeProgramsFile {
  curriculumSource: string;
  programs: IoeProgram[];
}

export interface IoePaper {
  id: string;
  file: string;
  sem: string;
  subject: string;
  /** Google Drive preview URL — embeds the PDF in an iframe. */
  previewUrl: string;
  /** Google Drive download URL. */
  downloadUrl: string;
  /** Google Drive standard view URL (direct tab). */
  driveViewUrl: string;
}

export interface IoeQuestionVariation {
  year: string;
  text: string;
  marks?: string;
}

export interface IoeQuestion {
  chapter: string;
  text: string;
  marks?: string;
  years: string[];
  frequency: number;
  variations?: IoeQuestionVariation[];
}

export interface IoeSubjectQuestions {
  subject: string;
  generated?: string;
  chapters: string[];
  questions: IoeQuestion[];
}

export interface IoeSyllabusTopic {
  num: string;
  title: string;
}

export interface IoeSyllabusUnit {
  num: number;
  title: string;
  topics: IoeSyllabusTopic[];
}

export interface IoeSyllabus {
  /** Official full-syllabus PDF URL (TU portal). */
  syllabus: string | null;
  /** Official micro-syllabus PDF URL (TU portal). */
  micro: string | null;
  units?: IoeSyllabusUnit[];
}

export interface IoeQuestionIndexEntry {
  questions: number;
  words: number;
  public: boolean;
}
