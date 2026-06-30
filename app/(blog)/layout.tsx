import Link from "next/link";
import { Search, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/blog/ThemeToggle";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="blog-section min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b border-[var(--blog-border)] bg-[var(--blog-bg)]/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link
              href="/blog"
              className="text-xl font-semibold tracking-tight text-[var(--blog-text)]"
            >
              Subesh<span className="text-[var(--blog-accent)]">.</span>Blog
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="/blog"
                className="text-sm font-medium text-[var(--blog-text-secondary)] hover:text-[var(--blog-accent)] transition-colors"
              >
                Home
              </Link>
              <Link
                href="/blog/search"
                className="text-sm font-medium text-[var(--blog-text-secondary)] hover:text-[var(--blog-accent)] transition-colors"
              >
                Search
              </Link>
              <Link
                href="/blog/author"
                className="text-sm font-medium text-[var(--blog-text-secondary)] hover:text-[var(--blog-accent)] transition-colors"
              >
                Author
              </Link>
              <Link
                href="/"
                className="text-sm font-medium text-[var(--blog-text-secondary)] hover:text-[var(--blog-accent)] transition-colors"
              >
                Portfolio
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link
                href="/blog/search"
                className="p-2 rounded-full hover:bg-[var(--blog-surface)] transition-colors"
                aria-label="Search"
              >
                <Search className="h-5 w-5 text-[var(--blog-text-secondary)]" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-[var(--blog-border)] bg-[var(--blog-surface)]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <Link
                href="/blog"
                className="text-lg font-semibold text-[var(--blog-text)]"
              >
                Subesh<span className="text-[var(--blog-accent)]">.</span>Blog
              </Link>
              <p className="mt-3 text-sm text-[var(--blog-text-secondary)] leading-relaxed">
                Essays, poems, SEE/BLB notes, and educational content in Nepali
                and English.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--blog-text)]">
                Quick Links
              </h3>
              <ul className="mt-3 space-y-2">
                <li>
                  <Link
                    href="/blog"
                    className="text-sm text-[var(--blog-text-secondary)] hover:text-[var(--blog-accent)] transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog/search"
                    className="text-sm text-[var(--blog-text-secondary)] hover:text-[var(--blog-accent)] transition-colors"
                  >
                    Search
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog/author"
                    className="text-sm text-[var(--blog-text-secondary)] hover:text-[var(--blog-accent)] transition-colors"
                  >
                    Author
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--blog-text)]">
                Connect
              </h3>
              <ul className="mt-3 space-y-2">
                <li>
                  <a
                    href="https://github.com/subeshyadav3"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[var(--blog-text-secondary)] hover:text-[var(--blog-accent)] transition-colors"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/subeshyadav"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[var(--blog-text-secondary)] hover:text-[var(--blog-accent)] transition-colors"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-[var(--blog-border)] text-center text-sm text-[var(--blog-text-muted)]">
            © {new Date().getFullYear()} Subesh Yadav. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
