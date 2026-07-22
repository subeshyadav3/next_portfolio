import Link from "next/link";
import { Tag } from "@/lib/blog/types";

interface TagCloudProps {
  tags: Tag[];
}

export function TagCloud({ tags }: TagCloudProps) {
  if (tags.length === 0) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold text-[var(--blog-text)] mb-4">Tags</h2>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link
            key={tag.slug}
            href={`/blog/tag/${tag.slug}`}
            className="inline-flex items-center rounded-full bg-[var(--blog-surface)] border border-[var(--blog-border)] px-3 py-1 text-sm text-[var(--blog-text-secondary)] hover:border-[var(--blog-accent)] hover:text-[var(--blog-accent)] transition-colors"
          >
            #{tag.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
