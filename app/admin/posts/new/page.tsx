import { unstable_cache } from "next/cache";
import { prisma } from "@/db/prisma";
import { createPostAction } from "@/actions/posts";
import { PostEditor } from "@/components/admin/PostEditor";

const getCachedCategories = unstable_cache(
  () => prisma.category.findMany({ orderBy: { displayOrder: "asc" } }),
  ["admin:categories"],
  { revalidate: 3600, tags: ["categories:list"] }
);

const getCachedAuthors = unstable_cache(
  () => prisma.author.findMany({ orderBy: { name: "asc" } }),
  ["admin:authors"],
  { revalidate: 3600, tags: ["authors:list"] }
);

const getCachedTags = unstable_cache(
  () => prisma.tag.findMany({ orderBy: { name: "asc" } }),
  ["admin:tags"],
  { revalidate: 3600, tags: ["tags:list"] }
);

export default async function NewPostPage() {
  const [categories, authors, tags] = await Promise.all([
    getCachedCategories(),
    getCachedAuthors(),
    getCachedTags(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">New Post</h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Create a new blog post with MDX content.
      </p>

      <div className="mt-8">
        <PostEditor
          categories={categories}
          authors={authors}
          tags={tags}
          action={createPostAction}
        />
      </div>
    </div>
  );
}
