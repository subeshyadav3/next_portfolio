import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbProps {
  items: { label: string; href: string }[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-[var(--blog-text-muted)]">
        <li>
          <Link href="/blog" className="hover:text-[var(--blog-accent)] transition-colors">
            Blog
          </Link>
        </li>
        {items.slice(1).map((item, index) => (
          <li key={item.href} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4" />
            {index === items.length - 2 ? (
              <span className="text-[var(--blog-text)] line-clamp-1 max-w-[200px] sm:max-w-xs">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-[var(--blog-accent)] transition-colors line-clamp-1 max-w-[120px]"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
