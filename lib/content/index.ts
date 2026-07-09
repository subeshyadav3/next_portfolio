/**
 * Content access layer — barrel export with the default app source.
 *
 * Pages and components should import `posts` (the default CompositeSource)
 * instead of calling the filesystem directly. This gives us:
 *   - Cached reads (per-build memoization, per-tag invalidation)
 *   - DB-first, filesystem-fallback (the MDX files keep working)
 *   - A single seam to swap in a different source (e.g. for tests).
 */

import { CompositeSource } from "./composite-source";
import { MdxFileSource } from "./mdx-file-source";
import { PrismaPostSource } from "./prisma-post-source";

export type {
  NormalizedPost,
  NormalizedPostSummary,
  NormalizedCategory,
  NormalizedTag,
  NormalizedArchiveYear,
  ListOptions,
  AdjacentPosts,
  PostLanguage,
} from "./types";

export type { PostSource } from "./post-source";
export { CompositeSource } from "./composite-source";
export { MdxFileSource } from "./mdx-file-source";
export { PrismaPostSource } from "./prisma-post-source";

/**
 * The default source used by app code. Replace this with a custom
 * CompositeSource for tests or alternative deployments.
 */
export const posts: CompositeSource = new CompositeSource();
