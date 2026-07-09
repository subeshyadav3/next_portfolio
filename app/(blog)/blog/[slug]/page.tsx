import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  getAllPosts,
  getPostBySlug,
  getRelatedPosts,
  getPrevNextPosts,
  getAdjacentChapterPosts,
} from "@/lib/blog/posts";
import { SITE_URL } from "@/lib/site-config";
import { generatePostMetadata } from "@/lib/blog/seo";
import {
  generateArticleSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
} from "@/lib/blog/schema";
import { extractQAPairs } from "@/lib/blog/qa-parser";
import { compilePostMdx, extractTableOfContents } from "@/lib/blog/mdx";
import { formatDate } from "@/lib/blog/utils";
import {
  getCategorySlug,
  getCategoryLabel,
  getCategoryAccent,
  isExamCategory,
} from "@/lib/blog/categories";
import { BlogCard } from "@/components/blog/BlogCard";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { PrevNextNav } from "@/components/blog/PrevNextNav";
import { BackToTop } from "@/components/blog/BackToTop";
import { Breadcrumb } from "@/components/blog/Breadcrumb";
import { AuthorCard } from "@/components/blog/AuthorCard";

import { ReadingProgress } from "@/components/blog/ReadingProgress";
import EducationalBadges from "@/components/blog/EducationalBadges";
import { WasThisHelpful } from "@/components/blog/WasThisHelpful";
import { PostComments } from "@/components/blog/PostComments";
import { getComments } from "@/services/comments.service";
import { prisma } from "@/db/prisma";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return generatePostMetadata(post);
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const content = await compilePostMdx(post.content, post.category);
  const toc = extractTableOfContents(post.content);
  const related = await getRelatedPosts(post, 3);
  const { prev, next } = await getPrevNextPosts(post);
  const adjacentChapters = await getAdjacentChapterPosts(post);
  const qaPairs = extractQAPairs(post.content);

  const categorySlugValue = getCategorySlug(post.category);
  const categoryLabel = getCategoryLabel(categorySlugValue);
  const categoryAccent = getCategoryAccent(categorySlugValue);

  const dbPost = post.source === "DB" ? await prisma.post.findUnique({ where: { slug: post.slug }, select: { id: true, allowComments: true } }) : null;
  const comments = dbPost ? await getComments(dbPost.id) : [];

  const articleSchema = generateArticleSchema(post, {
    classLevel: post.classLevel,
    subject: post.subject,
    board: post.board,
    difficulty: post.difficulty,
    examType: post.examType,
    series: post.series,
  });
  const faqSchema = qaPairs.length > 0 ? generateFAQSchema(qaPairs) : null;
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: `${SITE_URL}/blog` },
    {
      name: categoryLabel,
      url: `${SITE_URL}/blog/category/${categorySlugValue}`,
    },
    { name: post.title, url: `${SITE_URL}/blog/${post.slug}` },
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
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <ReadingProgress color={categoryAccent} />

      <article
        lang={post.language}
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
      >
        <Breadcrumb
          items={[
            { label: "Blog", href: "/blog" },
            {
              label: categoryLabel,
              href: `/blog/category/${categorySlugValue}`,
            },
            { label: post.title, href: `/blog/${post.slug}` },
          ]}
        />

        <header className="mx-auto max-w-3xl pt-8 pb-12 text-center">
          <Link
            href={`/blog/category/${categorySlugValue}`}
            className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium"
            style={{
              backgroundColor: `color-mix(in srgb, ${categoryAccent} 15%, transparent)`,
              color: categoryAccent,
            }}
          >
            {categoryLabel}
          </Link>

          <EducationalBadges post={post} />

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
              {toc.length > 0 && (
                <div className="mb-8 lg:hidden">
                  <TableOfContents items={toc} accentColor={categoryAccent} />
                </div>
              )}

              <div className="blog-prose blog-devanagari max-w-none">
                {content}
              </div>

              {(adjacentChapters.prev || adjacentChapters.next) && (
                <nav
                  className="my-8 flex flex-col gap-3 rounded-xl border border-[var(--blog-border)] bg-[var(--blog-surface)] p-5 sm:flex-row sm:items-center sm:justify-between"
                  aria-label="Chapter navigation"
                >
                  {adjacentChapters.prev ? (
                    <Link
                      href={`/blog/${adjacentChapters.prev.slug}`}
                      className="text-sm text-[var(--blog-text-secondary)] hover:text-[var(--blog-accent)]"
                    >
                      <span className="block text-xs text-[var(--blog-text-muted)]">
                        Previous
                      </span>
                      ← {adjacentChapters.prev.title}
                    </Link>
                  ) : (
                    <span />
                  )}
                  {adjacentChapters.next ? (
                    <Link
                      href={`/blog/${adjacentChapters.next.slug}`}
                      className="text-right text-sm text-[var(--blog-text-secondary)] hover:text-[var(--blog-accent)] sm:ml-auto"
                    >
                      <span className="block text-xs text-[var(--blog-text-muted)]">
                        Next
                      </span>
                      {adjacentChapters.next.title} →
                    </Link>
                  ) : (
                    <span />
                  )}
                </nav>
              )}

              {isExamCategory(post.category) && <WasThisHelpful />}

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

              {dbPost && dbPost.allowComments && (
                <div className="mt-12">
                  <PostComments postId={dbPost.id} initialComments={comments} />
                </div>
              )}
            </div>

            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-8">
                {toc.length > 0 && (
                  <TableOfContents items={toc} accentColor={categoryAccent} />
                )}
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
