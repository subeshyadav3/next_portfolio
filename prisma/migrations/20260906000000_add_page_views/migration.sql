-- CreateTable
CREATE TABLE IF NOT EXISTS "PageView" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "slug" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PageView_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "PageView_createdAt_idx" ON "PageView"("createdAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "PageView_slug_createdAt_idx" ON "PageView"("slug", "createdAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "PageView_path_idx" ON "PageView"("path");
