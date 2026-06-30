import Link from "next/link";

interface AuthorCardProps {
  name: string;
  url: string;
  bio?: string;
}

export function AuthorCard({ name, url, bio }: AuthorCardProps) {
  return (
    <div className="rounded-xl border border-[var(--blog-border)] bg-[var(--blog-surface)] p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--blog-accent-light)] text-lg font-bold text-[var(--blog-accent)]">
          {name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="font-semibold text-[var(--blog-text)]">
            <Link
              href="/blog/author"
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
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm text-[var(--blog-accent)] hover:underline"
          >
            View profile →
          </a>
        </div>
      </div>
    </div>
  );
}
