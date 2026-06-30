import { notFound } from "next/navigation";
import Link from "next/link";
import { getArchiveYears, getPostsByYear } from "@/lib/blog/posts";
import { generateArchiveMetadata } from "@/lib/blog/seo";
import { BlogCard } from "@/components/blog/BlogCard";
import { Breadcrumb } from "@/components/blog/Breadcrumb";
import { Newsletter } from "@/components/blog/Newsletter";

interface PageProps {
  params: Promise<{ year: string }>;
}

export async function generateStaticParams() {
  return getArchiveYears().map((archive) => ({ year: archive.year }));
}

export async function generateMetadata({ params }: PageProps) {
  const { year } = await params;
  return generateArchiveMetadata(year);
}

export default async function ArchivePage({ params }: PageProps) {
  const { year } = await params;
  const archives = getArchiveYears();
  const archive = archives.find((a) => a.year === year);

  if (!archive) {
    notFound();
  }

  const posts = getPostsByYear(year);

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: "Blog", href: "/blog" },
            { label: year, href: `/blog/archive/${year}` },
          ]}
        />

        <div className="mt-8">
          <h1 className="text-4xl font-bold text-[var(--blog-text)]">
            Archive {year}
          </h1>
          <p className="mt-3 text-lg text-[var(--blog-text-secondary)]">
            {posts.length} article{posts.length !== 1 ? "s" : ""} published in {year}.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {posts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-[var(--blog-border)] bg-[var(--blog-surface)] p-12 text-center">
            <p className="text-[var(--blog-text-secondary)]">
              No articles found for this year.
            </p>
            <Link
              href="/blog"
              className="mt-4 inline-block text-[var(--blog-accent)] hover:underline"
            >
              Back to blog home
            </Link>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Newsletter />
      </section>
    </>
  );
}
