# IOE Question-Paper System: Reviewed Integration Plan

## 1. Product boundary

`/ioe` will be a separate, optional product area focused mainly on IOE past-question papers, not a blog category and not `/blog/ioe`.

- `/blog` remains the existing general publishing system.
- `/ioe` gets its own navigation, routes, program/semester/subject hierarchy, PDF viewer, question analysis, search, and SEO.
- The existing authentication, database connection, media management, and admin shell can be reused.
- IOE editorial posts can be created with the existing post editor, but structured IOE data must not be stored as ordinary blog posts.
- Disabling public IOE must not delete its data or affect `/`, `/blog`, existing posts, or admin authentication.

## 2. Existing project findings

The site already has useful infrastructure:

- Next.js 15 App Router, TypeScript, Tailwind CSS, Prisma, and PostgreSQL.
- Blog routes under `app/(blog)/blog`.
- Admin posts under `app/admin/posts` with create/edit, status, categories, tags, educational metadata, and SEO fields.
- `Post` already includes metadata such as `metaTitle`, `metaDescription`, `canonicalUrl`, `focusKeyword`, `noindex`, `subject`, and `examType` (including `IOE`).
- An existing `/pdf-viewer` route provides a basic embedded viewer and download action.
- The sitemap currently contains only home and blog URLs.

The important current limitation is that all database posts are implicitly blog posts. Blog queries do not distinguish blog content from IOE content. A first-class content-area field is required before IOE posts are added.

## 3. Scraped PYQ corpus

The scrape is already complete and remains the source corpus:

| Item | Value |
|---|---|
| PDFs | 229 valid PDF files, 0 failed |
| Subject folders | 182 |
| Size | About 2.4 GB |
| Location | `/mnt/subesh-main/Study/pyq/` |
| Layout | `/mnt/subesh-main/Study/pyq/<Subject>/<semester>_<faculty>.pdf` |
| Manifest | `/mnt/subesh-main/Study/pyq/index.json` |

Cleanup required before import:

- Re-parse the faculty/program column because the current manifest recorded the subject name in that field.
- Normalize aliases and spelling variants without renaming the source files destructively.
- Add stable subject IDs and canonical slugs.
- Record source URL, local filename, checksum, file size, semester, curriculum version, and old/new-course status.
- Record that the Digital NCE 7th-semester page currently exposes empty links; missing papers must remain explicitly marked as unavailable.

## 4. Modular design and disconnect switch

### Public feature flag

Create one server-side feature switch:

```env
IOE_ENABLED=true
```

Expose it through a single helper such as `lib/ioe/config.ts`. Do not spread direct environment checks across components.

When `IOE_ENABLED=false`:

- Every public `/ioe` route returns `notFound()`.
- The IOE navigation and footer links are omitted.
- IOE URLs are omitted from the sitemap and internal search.
- No IOE data is queried from public pages.
- `/blog` and all existing routes continue normally.
- IOE database records and PDFs are retained.
- Admin IOE records may remain accessible so work can continue while the public section is offline.

This is a disconnect, not an uninstall. It provides an immediate rollback without a migration or data deletion.

### Module isolation

Keep IOE implementation grouped so it can later be removed with a small, known set of changes:

```text
app/(ioe)/ioe/**
components/ioe/**
lib/ioe/**
services/ioe/**
actions/ioe/**
data/ioe/**
scripts/ioe-*.ts
```

Only shared integration points should be modified:

- `components/navbar/navbar.tsx`
- footer navigation
- `app/sitemap.ts` or an IOE sitemap route
- admin posts filter/editor
- Prisma schema and migration

No blog component should import from `lib/ioe`. IOE may reuse generic UI or MDX rendering, but the dependency must not point from blog to IOE.

## 5. Content architecture

Use two related but separate content systems.

### A. Shared editorial posts

Add a persisted enum to the existing `Post` model:

```prisma
enum ContentArea {
  BLOG
  IOE
}

model Post {
  // existing fields
  contentArea ContentArea @default(BLOG)
  ioeSubjectId String?
  ioeSubject IoeSubject? @relation(fields: [ioeSubjectId], references: [id])

  @@index([contentArea, status, publishedAt])
  @@index([ioeSubjectId])
}
```

`@default(BLOG)` is intentional: all existing persisted posts remain blog posts after migration.

Editorial IOE posts can contain study guides, chapter notes, paper explanations, solutions, notices, and subject introductions. A post optionally links to an IOE subject. Its public canonical URL is `/ioe/posts/[slug]`, never `/blog/[slug]`.

All blog readers, category pages, search, archives, featured queries, related-post queries, RSS, and sitemap generation must explicitly filter `contentArea = BLOG`. IOE readers must explicitly filter `contentArea = IOE`. This prevents leakage in either direction.

### B. Structured IOE records

Do not represent programs, semesters, subjects, PDF files, or individual exam questions as posts. Add dedicated models (exact field names finalized during implementation):

```text
IoeProgram
  id, code, slug, name, fullName, active, displayOrder

IoeCurriculum
  id, programId, name/version, effectiveYear, sourceUrl, active

IoeSubject
  id, curriculumId, semester, code, slug, name, aliases, description

IoePaper
  id, subjectId, examYear, examSession, courseType, sourceUrl,
  storageKey, originalFilename, checksum, sizeBytes, published

IoeChapter
  id, subjectId, chapterNumber, slug, title, displayOrder

IoeQuestion
  id, paperId, chapterId, questionNumber, text, marks,
  normalizedText, confidence, reviewStatus
```

Frequency is calculated from normalized questions across distinct papers. It should not be entered manually as a mutable number.

This split keeps the exam-paper domain reliable while still allowing rich admin-authored SEO content through `Post`.

## 6. Public route structure

```text
/ioe
  Program directory, popular subjects, latest papers, IOE search

/ioe/[program]
  Program overview and semester navigation

/ioe/[program]/semester/[semester]
  Official subjects for that program and semester

/ioe/[program]/semester/[semester]/[subject]
  Canonical subject/PYQ page

/ioe/posts/[slug]
  IOE editorial post created through the shared post editor

/ioe/search
  Search subjects, papers, questions, and IOE posts only
```

The subject page is the primary Google landing page. It includes:

1. Program, semester, course code, curriculum/version, and breadcrumbs.
2. Available paper/year selector.
3. Embedded PDF viewer with loading/error fallback.
4. Explicit Download/Open PDF actions.
5. Chapter-wise questions below the viewer.
6. Frequency, paper year/session, marks, and source references.
7. Related subjects and related IOE editorial posts.
8. Last-reviewed date, data-source attribution, and corrections/report link.

Use one canonical subject URL even when the same shared subject appears in more than one program. If program context produces equivalent pages, choose one canonical record or ensure each page has substantially program-specific content; do not publish duplicate indexable pages.

## 7. Admin integration

### `/admin/posts` filter

Add a two-option content-area filter above the existing table:

- **Blog** — default
- **IOE**

Recommended URLs:

```text
/admin/posts?area=blog
/admin/posts?area=ioe
/admin/posts/new?area=blog
/admin/posts/new?area=ioe
```

Behavior:

- Missing/invalid `area` defaults to `blog`.
- Pagination, status, and search preserve the selected area in query parameters.
- The table displays an Area column or badge.
- The View action resolves to `/blog/[slug]` for BLOG and `/ioe/posts/[slug]` for IOE.
- Creating from the IOE tab preselects and persists `contentArea=IOE`.
- Editing preserves content area unless the administrator intentionally changes it.
- Revalidation targets only the affected area; an IOE edit must not invalidate every blog page.

### Post editor behavior

Add a required `Content Area` selector, defaulting to Blog. When IOE is selected, show IOE-specific fields:

- Program (optional for general IOE posts)
- Semester (optional)
- Linked subject (optional)
- Exam type fixed/defaulted to IOE
- IOE-focused URL preview (`/ioe/posts/slug`)

Keep current MDX, media, tags, status, and SEO fields. Do not infer IOE solely from `examType=IOE`; `contentArea` is the routing and isolation field.

### Structured IOE administration

`/admin/posts?area=ioe` manages editorial IOE posts only. Structured data needs dedicated admin screens because a post editor cannot safely edit paper/question relationships:

```text
/admin/ioe/programs
/admin/ioe/subjects
/admin/ioe/papers
/admin/ioe/questions
/admin/ioe/imports
```

The IOE posts tab should include a visible link to **Manage IOE data**. This satisfies one admin experience without forcing relational exam data into MDX.

Important actions:

- Import/reconcile scraped manifest (idempotent, checksum based).
- Attach/upload/replace a PDF.
- Publish/unpublish a paper.
- Edit program, curriculum, semester, course code, aliases, and chapter mapping.
- Review OCR/extracted questions before publication.
- Merge duplicate normalized questions and correct frequency groups.
- Preserve an audit trail for destructive/import operations.

## 8. PDF storage

The 2.4 GB corpus must not be committed directly to the Git repository or bundled into a Vercel deployment.

Recommended storage abstraction:

```ts
interface IoePaperStorage {
  getPublicUrl(storageKey: string): string;
  getDownloadUrl(storageKey: string): string;
}
```

Use the local `/mnt/subesh-main/Study/pyq` corpus as import source. For production, upload to object storage (Cloudflare R2/S3-compatible storage is preferable for PDFs; Cloudinary is possible but less natural for a large PDF archive). Save only the storage key and metadata in PostgreSQL.

PDF downloads should use stable first-party routes when practical, for example `/ioe/papers/[paperId]/download`, so storage providers can change without changing indexed subject URLs.

## 9. Question extraction and review

Question text below the PDF requires a repeatable pipeline:

1. Extract text with `pdftotext`; use OCR only for scanned/image-only papers.
2. Detect year/session, question numbers, subquestions, and marks.
3. Normalize spacing and punctuation while preserving original text.
4. Map questions to official syllabus chapters.
5. Calculate similarity groups across papers and derive frequency from distinct papers.
6. Mark low-confidence extraction/classification as `NEEDS_REVIEW`.
7. Publish only reviewed questions initially; PDF viewing remains available even when extraction is incomplete.

LLM classification can assist chapter mapping, but deterministic source references and human review are required. Never publish invented marks, years, chapters, or question text.

## 10. SEO plan

### Technical SEO

- Generate unique metadata for `/ioe`, each program, semester, subject, and IOE post.
- Use canonical URLs under `/ioe`; IOE posts must never canonicalize to `/blog`.
- Add all enabled, published IOE pages to the sitemap. Exclude them when `IOE_ENABLED=false`.
- Set `noindex` on draft, empty, duplicate, or low-value pages.
- Add breadcrumbs and strong internal links: program → semester → subject → related post.
- Keep stable slugs; store aliases/redirects when official course names change.
- Return real 404s for unknown or disabled records, not empty 200 pages.
- Ensure mobile-friendly PDF fallback and accessible question HTML; the PDF alone is not enough for indexing.
- Optimize server queries and statically cache public curriculum data where appropriate.

### Structured data

Use only schema that matches visible page content:

- `BreadcrumbList` on nested routes.
- `CollectionPage` / `ItemList` for program and semester listings.
- `LearningResource` or `DigitalDocument` for subject paper resources.
- `Article` for IOE editorial posts.
- `FAQPage` only when the page visibly contains genuine question-and-answer pairs; do not apply FAQ schema to unanswered exam questions.

### Content quality

Each subject page should have unique useful HTML beyond an iframe:

- Official course name/code and curriculum context.
- Available exam years/sessions.
- Chapter list and reviewed extracted questions.
- Frequently repeated topics based on actual paper evidence.
- Clear attribution to source institutions/mirrors without claiming official ownership.
- Original explanatory copy, not copied boilerplate across hundreds of pages.

Avoid indexing placeholder pages for programs or semesters that have no papers or useful syllabus data.

## 11. Curriculum ingestion

Use `https://ioe.tu.edu.np/pages/undergraduate-be-124` as the program directory and individual official curriculum pages as the authority for program, semester, course code, credits, and course-title relationships.

Store source URL and curriculum version/effective year. Do not assume one universal semester placement: old/new curricula and shared subjects can differ. Imported Digital NCE papers must be matched to an official subject with an explicit review state when the name is ambiguous.

## 12. Delivery phases

| Phase | Scope | Acceptance condition |
|---|---|---|
| 0 | Schema/isolation | `ContentArea` migration defaults existing posts to BLOG; all blog readers explicitly exclude IOE; feature flag works |
| 1 | Corpus cleanup | Manifest faculty fixed, aliases normalized, checksums generated, official programs/curricula/subjects imported |
| 2 | Admin posts | Blog/IOE tabs, editor area field, correct View URLs, area-preserving pagination/search/revalidation |
| 3 | Core IOE UI | `/ioe` hierarchy, subject pages, year selector, PDF viewer/download, responsive navigation |
| 4 | IOE data admin | Programs/subjects/papers/import screens, publish controls, storage upload/sync |
| 5 | Questions | Extraction/OCR, chapter mapping, review workflow, evidence-based frequency display |
| 6 | SEO/launch | Metadata, canonical, schemas, sitemap, redirects, noindex rules, accessibility/performance checks |
| 7 | Disconnect test | With `IOE_ENABLED=false`, all public IOE entry points disappear/404 and blog tests still pass |

## 13. Tests required

- Existing posts remain BLOG after migration.
- `/blog`, blog search, categories, tags, RSS, archives, related posts, and sitemap never include IOE posts.
- `/ioe` never includes BLOG posts in its editorial listings/search.
- Admin defaults to Blog and preserves area through pagination/search/create/edit.
- View link is correct for each area.
- Disabling IOE removes navigation/sitemap entries and returns 404 for all public IOE routes.
- PDF permissions, missing-file fallback, and download headers work.
- Canonical URLs and structured data match visible routes/content.
- Duplicate subject aliases resolve or redirect to one canonical URL.

## 14. Decisions needed before implementation

1. Production deployment/storage: Vercel + R2/S3, self-hosted with mounted storage, or another target.
2. First launch scope: BCT only (recommended for a complete quality pilot) or every program with currently available PDFs.
3. Public disable control: environment variable only (recommended first) or an additional admin setting stored in `SiteSettings`.
4. Whether public IOE editorial posts need comments. Default recommendation: disable comments for question-paper/resource posts unless moderation is wanted.
