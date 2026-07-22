import { Metadata } from "next";
import { getAllPosts, getCategories, getTags } from "@/lib/blog/posts";
import { buildSearchIndex } from "@/lib/blog/search";
import { SearchClient } from "@/components/blog/SearchClient";
import { Breadcrumb } from "@/components/blog/Breadcrumb";

export const metadata: Metadata = {
  title: "Search | Neb Master",
  description:
    "Search essays, poems, SEE/BLB notes, and educational content in Nepali and English.",
};

export default async function SearchPage() {
  const posts = await getAllPosts();
  const searchIndex = buildSearchIndex(posts);
  const categories = await getCategories();
  const tags = await getTags();

  return (
    <>
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: "Blog", href: "/blog" },
            { label: "Search", href: "/blog/search" },
          ]}
        />

        <div className="mt-8">
          <h1 className="text-4xl font-bold text-[var(--blog-text)]">Search</h1>
          <p className="mt-3 text-lg text-[var(--blog-text-secondary)]">
            Find articles in English and Nepali. Use filters to narrow results.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-12 sm:px-6 lg:px-8">
        <SearchClient
          posts={searchIndex}
          categories={categories}
          tags={tags}
        />
      </section>

    </>
  );
}
