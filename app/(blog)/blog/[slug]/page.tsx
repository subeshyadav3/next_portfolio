import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  getAllPosts,
  getPostBySlug,
  getRelatedPosts,
  getPrevNextPosts,
} from "@/lib/blog/posts";
import { generatePostMetadata } from "@/lib/blog/seo";
import {
  generateArticleSchema,
  generateBreadcrumbSchema,
} from "@/lib/blog/schema";
import { compilePostMdx, extractTableOfContents } from "@/lib/blog/mdx";
import { formatDate } from "@/lib/blog/utils";
import { categorySlug } from "@/lib/blog/slugs";
import { BlogCard } from "@/components/blog/BlogCard";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { PrevNextNav } from "@/components/blog/PrevNextNav";
import { Newsletter } from "@/components/blog/Newsletter";
import { BackToTop } from "@/components/blog/BackToTop";
import { Breadcrumb } from "@/components/blog/Breadcrumb";
import { AuthorCard } from "@/components/blog/AuthorCard";
import { GiscusComments } from "@/components/blog/GiscusComments";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return generatePostMetadata(post);
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const content = await compilePostMdx(post.content);
  const toc = extractTableOfContents(post.content);
  const related = getRelatedPosts(post, 3);
  const { prev, next } = getPrevNextPosts(post);

  const articleSchema = generateArticleSchema(post);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://subeshyadav.com.np/blog" },
    {
      name: post.category,
      url: `https://subeshyadav.com.np/blog/category/${categorySlug(post.category)}`,
    },
    { name: post.title, url: `https://subeshyadav.com.np/blog/${post.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <article className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: "Blog", href: "/blog" },
            {
              label: post.category,
              href: `/blog/category/${categorySlug(post.category)}`,
            },
            { label: post.title, href: `/blog/${post.slug}` },
          ]}
        />

        <header className="mx-auto max-w-3xl pt-8 pb-12 text-center">
          <Link
            href={`/blog/category/${categorySlug(post.category)}`}
            className="inline-flex items-center rounded-full bg-[var(--blog-accent-light)] px-3 py-1 text-sm font-medium text-[var(--blog-accent)]"
          >
            {post.category}
          </Link>

          <h1 className="mt-6 text-3xl font-bold tracking-tight text-[var(--blog-text)] sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          <p className="mt-4 text-lg text-[var(--blog-text-secondary)]">
            {post.description}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-[var(--blog-text-muted)]">
            <span>{post.author}</span>
            <span>·</span>
            <time dateTime={post.published}>
              {formatDate(post.published)}
            </time>
            {post.updated !== post.published && (
              <>
                <span>·</span>
                <span>Updated {formatDate(post.updated)}</span>
              </>
            )}
            <span>·</span>
            <span>{post.readingTime} min read</span>
          </div>
        </header>

        {post.image && (
          <div className="mx-auto max-w-4xl mb-12">
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
              <Image
                src={post.image}
                alt={post.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>
          </div>
        )}

        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12">
            <div>
              <div className="blog-prose blog-devanagari max-w-none">
                {content}
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog/tag/${categorySlug(tag)}`}
                    className="rounded-full border border-[var(--blog-border)] bg-[var(--blog-surface)] px-3 py-1 text-sm text-[var(--blog-text-secondary)] hover:border-[var(--blog-accent)] hover:text-[var(--blog-accent)] transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>

              <div className="mt-12 border-t border-[var(--blog-border)] pt-8">
                <ShareButtons title={post.title} slug={post.slug} />
              </div>

              <div className="mt-12">
                <AuthorCard
                  name={post.author}
                  url={post.authorUrl}
                  bio="Writer and educator sharing Nepali essays, poems, and study materials."
                />
              </div>

              <div className="mt-12">
                <GiscusComments slug={post.slug} />
              </div>
            </div>

            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-8">
                {toc.length > 0 && <TableOfContents items={toc} />}
                <Newsletter />
              </div>
            </aside>
          </div>
        </div>
      </article>

      {(prev || next) && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <PrevNextNav prev={prev} next={next} />
        </section>
      )}

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 border-t border-[var(--blog-border)]">
          <h2 className="text-2xl font-bold text-[var(--blog-text)] mb-6">
            Related Articles
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}

      <BackToTop />
    </>
  );
}
