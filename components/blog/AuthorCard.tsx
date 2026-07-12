import Link from "next/link";

interface AuthorCardProps {
  name: string;
  authorSlug: string;
  bio?: string;
}

export function AuthorCard({ name, authorSlug, bio }: AuthorCardProps) {
  return (
    <div className="rounded-xl border border-[var(--blog-border)] bg-[var(--blog-surface)] p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--blog-accent-light)] text-lg font-bold text-[var(--blog-accent)]">
          {name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="font-semibold text-[var(--blog-text)]">
            <Link
              href={`/blog/author/${authorSlug}`}
              className="hover:text-[var(--blog-accent)] transition-colors"
            >
              {name}
            </Link>
          </h3>
          {bio && (
            <p className="mt-1 text-sm leading-relaxed text-[var(--blog-text-secondary)]">
              {bio}
            </p>
          )}
          <Link
            href={`/blog/author/${authorSlug}`}
            className="mt-2 inline-block text-sm text-[var(--blog-accent)] hover:underline"
          >
            View profile →
          </Link>
        </div>
      </div>
    </div>
  );
}
