-- =============================================================================
-- Full-Text Search support for Post
-- =============================================================================
-- Adds a tsvector column populated by a trigger that concatenates the
-- title (weight A), excerpt (weight B) and content (weight C). The GIN
-- index makes phrase + prefix queries fast even at 5k+ posts.
-- =============================================================================

-- Add the column (Prisma cannot manage tsvector via schema migrations)
ALTER TABLE "Post"
  ADD COLUMN IF NOT EXISTS search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('simple', coalesce("title", '')), 'A') ||
    setweight(to_tsvector('simple', coalesce("excerpt", '')), 'B') ||
    setweight(to_tsvector('simple', coalesce("content", '')), 'C')
  ) STORED;

-- GIN index for fast FTS lookups
CREATE INDEX IF NOT EXISTS "Post_search_vector_idx"
  ON "Post" USING GIN (search_vector);

-- Helpful secondary indexes for filter + sort
CREATE INDEX IF NOT EXISTS "Post_status_publishedAt_idx"
  ON "Post" ("status", "publishedAt" DESC NULLS LAST);

CREATE INDEX IF NOT EXISTS "Post_categoryId_status_publishedAt_idx"
  ON "Post" ("categoryId", "status", "publishedAt" DESC NULLS LAST);
