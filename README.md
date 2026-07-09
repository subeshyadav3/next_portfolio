# Portfolio & Educational CMS

A Next.js portfolio website and educational CMS platform with ~5,000 articles for Nepali exam preparation content (SEE, NEB, BLE, IOE).

## Prerequisites

- Node.js 20+
- PostgreSQL 15+ (local or remote)
- Cloudinary account (media uploads)
- Auth secret (generate via `openssl rand -hex 32`)

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/portfolio?schema=public"

# Auth
AUTH_SECRET="your-generated-secret"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

## Quick Start

```bash
git clone https://github.com/subeshyadav3/subesh
cd subesh
npm install
cp .env.example .env        # fill in your env vars
npx prisma db push          # create DB tables
npm run seed                # seed base data (admin, categories)
npm run dev                 # http://localhost:3000
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (port 3000) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint check |
| `npm run seed` | Seed DB with base data |
| `npm run import:mdx` | Import legacy MDX files into DB |

## Admin Panel

Access `/admin/login` after seeding. The seed script creates an admin user (check output for credentials).

## Architecture

- **Content sources**: `MdxFileSource` (file-based) and `PrismaPostSource` (DB). A `CompositeSource` wraps both -- DB first, FS fallback.
- **Auth**: Auth.js v5 with credentials provider.
- **Media**: Cloudinary signed uploads via API route.
- **Search**: PostgreSQL full-text search (`tsvector`) with Fuse.js fallback.
- **Caching**: Next.js `unstable_cache` with tag-based revalidation (`posts:db`, `posts:mdx`).

## MDX to DB Import

```bash
npm run import:mdx
```

Reads all .mdx files from `final_content/blog/`, resolves category/tag/author names to DB IDs, and inserts posts. Safe to re-run -- skips existing slugs.

## Project Structure

```
prisma/            -- Schema, migrations, seed
services/          -- Business logic (posts, categories)
actions/           -- Server actions (admin CRUD)
components/
  admin/           -- Post editor, media uploader, dashboard
  blog/            -- MDX components, badges, cards
lib/
  blog/            -- SEO, schema, categories, slugs
  content/         -- PostSource abstractions
  auth/            -- Auth.js v5 config
scripts/           -- Migration and utility scripts
```
