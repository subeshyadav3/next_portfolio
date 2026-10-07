import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap } from "lucide-react";
import { getLatestPosts } from "@/lib/blog/posts";
import { formatDate } from "@/lib/blog/utils";
import { IOE_UI_VISIBLE } from "@/lib/ioe/config";

export default async function LatestWriting() {
  const posts = await getLatestPosts(3);
  if (posts.length === 0 && !IOE_UI_VISIBLE) return null;

  return (
    <section id="writing" className="py-20 px-6 sm:px-0">
      <div className="max-w-[900px] mx-auto w-full">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <p className="mono text-xs text-green uppercase tracking-widest mb-2">
              Writing &amp; resources
            </p>
            <h2 className="text-3xl font-bold text-primary">From the blog</h2>
          </div>
          <Link
            href="/blog"
            className="mono text-xs text-muted hover:text-green transition-colors inline-flex items-center gap-1"
          >
            All posts <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col p-5 transition-colors hover:border-green"
              style={{
                backgroundColor: "rgba(22, 27, 34, 0.5)",
                border: "1px solid var(--border)",
              }}
            >
              <span className="mono text-[10px] text-muted uppercase tracking-widest">
                {post.category}
              </span>
              <h3 className="mt-3 text-base font-semibold text-primary leading-snug group-hover:text-green transition-colors">
                {post.title}
              </h3>
              <p className="mt-2 text-sm text-secondary leading-relaxed line-clamp-3">
                {post.description}
              </p>
              <span className="mt-auto pt-4 mono text-[11px] text-muted">
                {formatDate(post.published)} · {post.readingTime} min read
              </span>
            </Link>
          ))}
        </div>

        {IOE_UI_VISIBLE && (
          <Link
            href="/ioe"
            className="group mt-4 flex items-center gap-4 p-5 transition-colors hover:border-green"
            style={{
              backgroundColor: "rgba(61,214,140,0.05)",
              border: "1px solid rgba(61,214,140,0.2)",
            }}
          >
            <span className="p-3 rounded-lg" style={{ backgroundColor: "rgba(61,214,140,0.1)" }}>
              <GraduationCap className="text-green" size={22} />
            </span>
            <span className="flex-1">
              <span className="block text-base font-semibold text-primary">
                IOE Papers — free past questions &amp; syllabus
              </span>
              <span className="block text-sm text-secondary">
                Tribhuvan University engineering question archive for BCT, BCE, BEX and more.
              </span>
            </span>
            <BookOpen className="hidden sm:block text-muted group-hover:text-green transition-colors" size={18} />
          </Link>
        )}
      </div>
    </section>
  );
}
