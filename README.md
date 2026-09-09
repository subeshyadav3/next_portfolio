# Portfolio & Educational CMS

A Next.js portfolio website and educational CMS platform with ~5,000 articles for Nepali exam preparation content (SEE, NEB, BLE, IOE) plus an IOE past-question (PYQ) archive with syllabus and frequency-ranked question banks.

## IOE PYQ Archive

Past-question papers, syllabus, and frequency-ranked question banks for IOE (Tribhuvan University) programs — currently covering BCT, BEI/BEX, and BCE.

- **Routes**: `/ioe`, `/ioe/all`, `/ioe/[program]`, `/ioe/[program]/semester/[semester]`, `/ioe/[program]/semester/[semester]/[subject]`, `/ioe/subjects/[slug]` (redirects to the canonical program page when the subject is in a curriculum)
- **Papers**: PDF metadata lives in `data/ioe/catalog.json` (173 subjects, 227 papers); files served via Cloudinary CDN with Google Drive fallback, rendered in an embedded viewer (`components/ioe/PdfViewer.tsx`)
- **Question banks**: 73 verbatim JSONs in `data/ioe/questions/<subject-slug>.json` with exam sessions, marks, and chapter mapping; loaded via `getSubjectQuestions()` in `lib/ioe/data.ts` (includes an alias slug map, e.g. `microprocessors-and-microcontrollers` → `microprocessors`)
- **Rendering**: `components/ioe/QuestionBank.tsx` (frequency-ranked + chapter views, search/chapter/frequency filters) and `components/ioe/MathText.tsx` (SSR-safe dynamic KaTeX with plain-text fallback)
- **Syllabus**: 80 entries in `data/ioe/syllabus.json`; per-subject exam scheme via `getAssessmentScheme()`
- **SEO**: per-page titles/descriptions/keywords, canonical URLs, breadcrumbs + FAQ + LearningResource JSON-LD, `robots.ts`/`sitemap.ts`, AdSense account meta + `public/ads.txt`

## Project Structure

```
prisma/            -- Schema, migrations, seed
services/          -- Business logic (posts, categories)
actions/           -- Server actions (admin CRUD)
components/
  admin/           -- Post editor, media uploader, dashboard
  blog/            -- MDX components, badges, cards
  ioe/             -- PdfViewer, QuestionBank, MathText, SyllabusSection
lib/
  blog/            -- SEO, schema, categories, slugs
  content/         -- PostSource abstractions
  auth/            -- Auth.js v5 config
  ioe/             -- data.ts (catalog/programs/syllabus/questions loaders), seo.ts, types.ts
data/ioe/          -- catalog.json, programs.json, syllabus.json, questions/*.json
app/(ioe)/ioe/     -- IOE routes (program/semester/subject pages)
scripts/           -- Migration and utility scripts
```
