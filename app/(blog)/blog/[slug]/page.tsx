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
import { MobileTocButton } from "@/components/blog/MobileTocButton";

import { ReadingProgress } from "@/components/blog/ReadingProgress";
import EducationalBadges from "@/components/blog/EducationalBadges";
import { WasThisHelpful } from "@/components/blog/WasThisHelpful";
import { PostComments } from "@/components/blog/PostComments";
import { getComments } from "@/services/comments.service";
import { prisma } from "@/db/prisma";
import { Clock, Calendar } from "lucide-react";

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

  if (!post || (process.env.SHOW_ALL_LANGUAGES !== "true" && post.language === "ne")) {
    notFound();
  }

  let content: React.ReactNode;
  try {
    content = await compilePostMdx(post.content, post.category);
  } catch (e) {
    console.error("MDX compilation failed for slug:", slug, e);
    notFound();
  }

  const toc = extractTableOfContents(post.content);
  const related = await getRelatedPosts(post, 3);
  const { prev, next } = await getPrevNextPosts(post);
  const adjacentChapters = await getAdjacentChapterPosts(post);
  const qaPairs = extractQAPairs(post.content);

  const categorySlugValue = getCategorySlug(post.category);
  const categoryLabel = getCategoryLabel(categorySlugValue);
  const categoryAccent = getCategoryAccent(categorySlugValue);

  let dbPost: { id: string; allowComments: boolean } | null = null;
  try {
    dbPost = await prisma.post.findUnique({ where: { slug: post.slug }, select: { id: true, allowComments: true } });
  } catch {
    // DB not available during build, skip
  }
  const comments = dbPost
    ? await getComments(dbPost.id)
    : await getComments("", post.slug);

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
    <div>
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
        <div className="mx-auto max-w-4xl">
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
        </div>

        {/* ── Article Header ── */}
        <header className="mx-auto max-w-4xl pt-8 pb-10 text-center">
          <Link
            href={`/blog/category/${categorySlugValue}`}
            className="inline-flex items-center rounded-full px-3.5 py-1 text-xs font-semibold tracking-wide transition-opacity hover:opacity-85"
            style={{
              backgroundColor: `color-mix(in srgb, ${categoryAccent} 15%, transparent)`,
              color: categoryAccent,
            }}
          >
            {categoryLabel}
          </Link>

          <EducationalBadges post={post} />

          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-[var(--blog-text)] sm:text-4xl lg:text-5xl lg:leading-[1.15]">
            {post.title}
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[var(--blog-text-secondary)] sm:text-lg">
            {post.description}
          </p>

          {/* Author & Editorial Metadata Pill */}
          <div className="mt-7 inline-flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-[var(--blog-border)] bg-[var(--blog-surface)] px-4 py-2.5 text-xs text-[var(--blog-text-secondary)] shadow-2xs">
            <Link
              href={`/blog/author/${post.authorSlug}`}
              className="flex items-center gap-2 font-semibold text-[var(--blog-text)] hover:text-[var(--blog-accent)] transition-colors"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--blog-accent)]/15 font-bold text-[var(--blog-accent)] text-[11px]">
                {post.author.charAt(0).toUpperCase()}
              </span>
              <span>{post.author}</span>
            </Link>
            <span className="text-[var(--blog-text-faint)]">·</span>
            <div className="flex items-center gap-1.5 text-[var(--blog-text-muted)]">
              <Calendar className="h-3.5 w-3.5" />
              <time dateTime={post.published}>
                {formatDate(post.published)}
              </time>
            </div>
            {post.updated !== post.published && (
              <>
                <span className="text-[var(--blog-text-faint)]">·</span>
                <span className="rounded-md bg-[var(--blog-bg)] px-2 py-0.5 text-[11px] text-[var(--blog-text-muted)]">
                  Updated {formatDate(post.updated)}
                </span>
              </>
            )}
            <span className="text-[var(--blog-text-faint)]">·</span>
            <div className="flex items-center gap-1.5 text-[var(--blog-text-muted)]">
              <Clock className="h-3.5 w-3.5" />
              <span>{post.readingTime} min read</span>
            </div>
          </div>
        </header>

        {/* ── Featured Cover Image ── */}
        {post.image && (
          <div className="mx-auto max-w-4xl mb-12">
            <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-[var(--blog-border)] bg-[var(--blog-surface2)] shadow-sm">
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

        {/* ── Main Article & TOC Grid ── */}
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] gap-12 items-start">
            {/* Reading Column */}
            <div className="min-w-0 max-w-[72ch] mx-auto lg:mx-0 w-full">
              <div className="blog-prose blog-devanagari max-w-none">
                {content}
              </div>

              {(adjacentChapters.prev || adjacentChapters.next) && (
                <nav
                  className="my-10 flex flex-col gap-3 rounded-2xl border border-[var(--blog-border)] bg-[var(--blog-surface)] p-5 sm:flex-row sm:items-center sm:justify-between shadow-xs"
                  aria-label="Chapter navigation"
                >
                  {adjacentChapters.prev ? (
                    <Link
                      href={`/blog/${adjacentChapters.prev.slug}`}
                      className="group text-sm text-[var(--blog-text-secondary)] hover:text-[var(--blog-accent)]"
                    >
                      <span className="block text-xs uppercase tracking-wider text-[var(--blog-text-muted)]">
                        Previous Chapter
                      </span>
                      <span className="font-semibold group-hover:underline">
                        ← {adjacentChapters.prev.title}
                      </span>
                    </Link>
                  ) : (
                    <span />
                  )}
                  {adjacentChapters.next ? (
                    <Link
                      href={`/blog/${adjacentChapters.next.slug}`}
                      className="group text-right text-sm text-[var(--blog-text-secondary)] hover:text-[var(--blog-accent)] sm:ml-auto"
                    >
                      <span className="block text-xs uppercase tracking-wider text-[var(--blog-text-muted)]">
                        Next Chapter
                      </span>
                      <span className="font-semibold group-hover:underline">
                        {adjacentChapters.next.title} →
                      </span>
                    </Link>
                  ) : (
                    <span />
                  )}
                </nav>
              )}

              {isExamCategory(post.category) && <WasThisHelpful />}

              <div className="my-8">
                <ShareButtons title={post.title} slug={post.slug} />
              </div>

              <div className="my-8">
                <AuthorCard
                  name={post.author}
                  authorSlug={post.authorSlug}
                  bio="Writer and educator sharing Nepali essays, poems, literature, and study notes."
                />
              </div>

              {(dbPost?.allowComments ?? post.source === "FILE") && (
                <div className="my-10 rounded-2xl border border-[var(--blog-border)] bg-[var(--blog-surface)] p-6 sm:p-8 shadow-xs">
                  <PostComments
                    postId={dbPost?.id ?? ""}
                    postSlug={dbPost ? undefined : post.slug}
                    initialComments={comments}
                  />
                </div>
              )}
            </div>

            {/* Sticky Table of Contents Sidebar */}
            <aside className="hidden lg:block sticky top-24">
              {toc.length > 0 && (
                <TableOfContents items={toc} accentColor={categoryAccent} />
              )}
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
      {toc.length > 0 && (
        <MobileTocButton items={toc} accentColor={categoryAccent} />
      )}
    </div>
  );
}
