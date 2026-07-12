import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAuthorBySlug, getPostsByAuthor } from "@/lib/blog/posts";
import { formatDate } from "@/lib/blog/utils";
import { Breadcrumb } from "@/components/blog/Breadcrumb";
import { SITE_URL } from "@/lib/site-config";
import {
  getCategorySlug,
  getCategoryLabel,
  getCategoryAccent,
} from "@/lib/blog/categories";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);
  if (!author) return { title: "Author Not Found" };

  return {
    title: `${author.name} | Neb Master`,
    description:
      author.bio ?? `Articles by ${author.name} on Neb Master.`,
    alternates: {
      canonical: `${SITE_URL}/blog/author/${slug}`,
    },
    openGraph: {
      title: `${author.name} — Author`,
      description: author.bio ?? `Articles by ${author.name}.`,
      type: "profile",
    },
  };
}

export default async function AuthorProfilePage({ params }: Props) {
  const { slug } = await params;
  const [author, posts] = await Promise.all([
    getAuthorBySlug(slug),
    getPostsByAuthor(slug),
  ]);

  if (!author) notFound();

  const socialLinks: { label: string; url: string; icon: string }[] = [];
  if (author.social) {
    if (author.social.github)
      socialLinks.push({ label: "GitHub", url: author.social.github, icon: "github" });
    if (author.social.linkedin)
      socialLinks.push({ label: "LinkedIn", url: author.social.linkedin, icon: "linkedin" });
    if (author.social.twitter)
      socialLinks.push({ label: "Twitter", url: author.social.twitter, icon: "twitter" });
    if (author.social.facebook)
      socialLinks.push({ label: "Facebook", url: author.social.facebook, icon: "facebook" });
  }

  return (
    <>
      {/* Profile header */}
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: "Blog", href: "/blog" },
            { label: "Authors", href: "/blog/author" },
            { label: author.name, href: `/blog/author/${slug}` },
          ]}
        />

        <div className="mt-8 rounded-2xl border border-[var(--blog-border)] bg-[var(--blog-surface)] p-8 md:p-12">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="shrink-0">
              {author.avatarUrl ? (
                <Image
                  src={author.avatarUrl}
                  alt={author.name}
                  width={120}
                  height={120}
                  className="rounded-full object-cover ring-4 ring-[var(--blog-accent)]/20"
                  priority
                />
              ) : (
                <div className="w-[120px] h-[120px] rounded-full bg-[var(--blog-accent)]/20 flex items-center justify-center text-4xl font-bold text-[var(--blog-accent)] ring-4 ring-[var(--blog-accent)]/20">
                  {author.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-[var(--blog-text)] sm:text-4xl">
                {author.name}
              </h1>
              {author.bio && (
                <p className="mt-3 max-w-2xl text-[var(--blog-text-secondary)] leading-relaxed">
                  {author.bio}
                </p>
              )}

              <div className="mt-5 flex flex-wrap gap-3">
                {author.websiteUrl && (
                  <a
                    href={author.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-[var(--blog-accent)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
                  >
                    Website
                  </a>
                )}
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-[var(--blog-border)] bg-[var(--blog-bg)] px-4 py-2 text-sm font-medium text-[var(--blog-text)] hover:border-[var(--blog-accent)] transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-[var(--blog-border)] pt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-[var(--blog-text)]">
                {author.postCount}
              </div>
              <div className="text-sm text-[var(--blog-text-secondary)]">
                Articles
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Author's posts */}
      <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-xl font-bold text-[var(--blog-text)] mb-6">
          Articles by {author.name}
        </h2>

        {posts.length === 0 ? (
          <div className="rounded-xl border border-[var(--blog-border)] bg-[var(--blog-surface)] p-8 text-center">
            <p className="text-[var(--blog-text-muted)]">
              No articles published yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="group flex flex-col overflow-hidden rounded-xl border border-[var(--blog-border)] bg-[var(--blog-surface)] shadow-sm hover:shadow-md transition-all duration-300"
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="relative aspect-[16/10] overflow-hidden bg-stone-100"
                >
                  {post.image ? (
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  ) : (
                    <Image
                      src="/images/blog-placeholder.svg"
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  )}
                </Link>

                <div className="flex flex-1 flex-col p-5">
                  <Link
                    href={`/blog/category/${getCategorySlug(post.category)}`}
                    className="inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-medium hover:opacity-80 transition-opacity"
                    style={{
                      backgroundColor: `color-mix(in srgb, ${getCategoryAccent(getCategorySlug(post.category))} 15%, transparent)`,
                      color: getCategoryAccent(getCategorySlug(post.category)),
                    }}
                  >
                    {getCategoryLabel(getCategorySlug(post.category))}
                  </Link>

                  <h3 className="mt-3 text-lg font-semibold leading-snug text-[var(--blog-text)] group-hover:text-[var(--blog-accent)] transition-colors line-clamp-2">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>

                  <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--blog-text-secondary)] line-clamp-3">
                    {post.description}
                  </p>

                  <div className="mt-4 flex items-center gap-3 text-xs text-[var(--blog-text-muted)]">
                    <time dateTime={post.published}>
                      {formatDate(post.published)}
                    </time>
                    <span>·</span>
                    <span>{post.readingTime} min read</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
