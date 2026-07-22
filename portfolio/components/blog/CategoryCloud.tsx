import Link from "next/link";
import { Category } from "@/lib/blog/types";

interface CategoryCloudProps {
  categories: Category[];
}

export function CategoryCloud({ categories }: CategoryCloudProps) {
  if (categories.length === 0) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold text-[var(--blog-text)] mb-4">
        Categories
      </h2>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/blog/category/${category.slug}`}
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--blog-border)] bg-[var(--blog-surface)] px-4 py-2 text-sm font-medium text-[var(--blog-text-secondary)] hover:border-[var(--blog-accent)] hover:text-[var(--blog-accent)] transition-colors"
          >
            <span>{category.name}</span>
            <span className="rounded-full bg-[var(--blog-accent-light)] px-2 py-0.5 text-xs text-[var(--blog-accent)]">
              {category.count}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
